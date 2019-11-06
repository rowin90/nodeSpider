const Spider = require("../models/mongoose/spider");
const HTTPReqParamsError = require("../errors/http_errors/http_request_params_error");
const HTTPBaseError = require("../errors/http_errors/http_base_error");
const axios = require("axios");
const logger = require("../utils/loggers/logger");
/**
 * 注册爬虫
 * @param  spider 爬虫服务对象
 * @param  spider.name 服务名，唯一
 * @param  spider.validationUrl 校验地址，唯一
 */
async function registerSpider(spider) {
  const validations = {
    name: name => {
      if (!name)
        throw new HTTPReqParamsError(
          "spider service name",
          "名字不能为空 ",
          "a spider service name can not be empty"
        );
    },
    validationUrl: url => {
      if (!url) {
        throw new HTTPReqParamsError(
          "spider service validation url",
          "验证 url 不能为空 ",
          "a spider service url can not be empty"
        );
      }
      if (url.indexOf("http") === -1) {
        throw new HTTPReqParamsError(
          "spider service validation url",
          "非法 url",
          "a spider service url must be a valid url"
        );
      }
    }
  };

  const keys = Object.keys(validations);
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    validations[k](spider[k]);
  }

  const res = await axios.get(spider.validationUrl).catch(e => {
    logger.error("error validating spider service on provided validation url", {
      errMsg: e.message,
      errStack: e.stack
    });
    throw new HTTPBaseError(
      400,
      "服务验证失败，请检查爬虫服务是否可用",
      400200,
      "error validating spider url"
    );
  });

  if (res && res.data) {
    const spiderServiceResponseValidation = {
      code: code => {
        if (code !== 0)
          throw new HTTPBaseError(
            400,
            `爬虫服务返回错误码:${code}`,
            400201,
            "spider service return a error code"
          );
      },
      protocol: protocol => {
        if (!protocol) {
          throw new HTTPBaseError(
            400,
            "协议错误:空的协议",
            400202,
            "spider validation url can not return a empty protocol obj"
          );
        }
        if (protocol.name !== "FULL_NET_SPIDER_PROTOCOL") {
          throw new HTTPBaseError(
            400,
            `协议错误:错误的版本${protocol.name}`,
            400203,
            `invalid spider service protocol name ${protocol.name}`
          );
        }
        if (protocol.version != "0.1") {
          throw new HTTPBaseError(
            400,
            `协议错误:错误的版本${protocol.version}`,
            400204,
            `invalid spider service protocol version ${protocol.version}`
          );
        }
      },
      config: config => {
        if (!config) {
          throw new HTTPBaseError(
            400,
            "协议错误:空的配置",
            400205,
            "spider validation url can not return a empty config obj"
          );
        }
        if (!config.contentList) {
          throw new HTTPBaseError(
            400,
            `配置错误:空的列表接口`,
            400206,
            `spider validation url can not return a empty config list obj`
          );
        }
        if (
          !config.contentList.url ||
          !config.contentList.pageSizeLimit ||
          !config.contentList.frequencyLimit
        ) {
          throw new HTTPBaseError(
            400,
            `配置错误:不完整的 contentList 对象`,
            400207,
            `spider validation url has to return a valid config content list obj`
          );
        }
      }
    };

    const keys = Object.keys(spiderServiceResponseValidation);
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      spiderServiceResponseValidation[k](res.data[k]);
    }
  }

  const toCreate = {
    name: spider.name,
    validationUrl: spider.validationUrl,
    contentList: res.data.config.contentList,
    singleContent: res.data.config.singleContent,
    status: "validated"
  };

  const createdSpider = await Spider.registerSpider(toCreate);
  return createdSpider;
}

module.exports = { registerSpider };
