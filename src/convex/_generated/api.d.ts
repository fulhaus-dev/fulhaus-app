/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent from "../agent.js";
import type * as config_cloudflare from "../config/cloudflare.js";
import type * as config_google from "../config/google.js";
import type * as config_openai from "../config/openai.js";
import type * as config_resend from "../config/resend.js";
import type * as config_x from "../config/x.js";
import type * as constant from "../constant.js";
import type * as email_internal_action from "../email/internal/action.js";
import type * as http from "../http.js";
import type * as middleware_authorization from "../middleware/authorization.js";
import type * as middleware_http_authorization from "../middleware/http/authorization.js";
import type * as middleware_internal_query from "../middleware/internal/query.js";
import type * as response_error from "../response/error.js";
import type * as response_success from "../response/success.js";
import type * as type from "../type.js";
import type * as util_array from "../util/array.js";
import type * as util_async from "../util/async.js";
import type * as util_date from "../util/date.js";
import type * as util_error from "../util/error.js";
import type * as util_fetch from "../util/fetch.js";
import type * as util_file from "../util/file.js";
import type * as util_generator from "../util/generator.js";
import type * as util_number from "../util/number.js";
import type * as util_object from "../util/object.js";
import type * as util_r2 from "../util/r2.js";
import type * as v1_auth_email_otp from "../v1/auth/email/otp.js";
import type * as v1_auth_http_action from "../v1/auth/http/action.js";
import type * as v1_auth_model from "../v1/auth/model.js";
import type * as v1_auth_mutation from "../v1/auth/mutation.js";
import type * as v1_auth_scheduler from "../v1/auth/scheduler.js";
import type * as v1_auth_table from "../v1/auth/table.js";
import type * as v1_auth_type from "../v1/auth/type.js";
import type * as v1_cart_model from "../v1/cart/model.js";
import type * as v1_cart_mutation from "../v1/cart/mutation.js";
import type * as v1_cart_query from "../v1/cart/query.js";
import type * as v1_cart_table from "../v1/cart/table.js";
import type * as v1_cart_validator from "../v1/cart/validator.js";
import type * as v1_chat_internal_mutation from "../v1/chat/internal/mutation.js";
import type * as v1_chat_internal_query from "../v1/chat/internal/query.js";
import type * as v1_chat_model from "../v1/chat/model.js";
import type * as v1_chat_mutation from "../v1/chat/mutation.js";
import type * as v1_chat_query from "../v1/chat/query.js";
import type * as v1_chat_table from "../v1/chat/table.js";
import type * as v1_chat_util from "../v1/chat/util.js";
import type * as v1_chat_validator from "../v1/chat/validator.js";
import type * as v1_design_constant from "../v1/design/constant.js";
import type * as v1_design_internal_action from "../v1/design/internal/action.js";
import type * as v1_design_internal_mutation from "../v1/design/internal/mutation.js";
import type * as v1_design_internal_query from "../v1/design/internal/query.js";
import type * as v1_design_model from "../v1/design/model.js";
import type * as v1_design_mutation from "../v1/design/mutation.js";
import type * as v1_design_query from "../v1/design/query.js";
import type * as v1_design_table from "../v1/design/table.js";
import type * as v1_design_type from "../v1/design/type.js";
import type * as v1_design_validator from "../v1/design/validator.js";
import type * as v1_ludwig_ai_agent from "../v1/ludwig/ai/agent.js";
import type * as v1_ludwig_ai_tool_design from "../v1/ludwig/ai/tool/design.js";
import type * as v1_ludwig_ai_tool_product from "../v1/ludwig/ai/tool/product.js";
import type * as v1_ludwig_ai_tool_recommendation from "../v1/ludwig/ai/tool/recommendation.js";
import type * as v1_ludwig_ai_tool_ui from "../v1/ludwig/ai/tool/ui.js";
import type * as v1_ludwig_ai_util from "../v1/ludwig/ai/util.js";
import type * as v1_ludwig_http_action from "../v1/ludwig/http/action.js";
import type * as v1_ludwig_internal_mutation from "../v1/ludwig/internal/mutation.js";
import type * as v1_ludwig_internal_query from "../v1/ludwig/internal/query.js";
import type * as v1_ludwig_model from "../v1/ludwig/model.js";
import type * as v1_ludwig_table from "../v1/ludwig/table.js";
import type * as v1_ludwig_type from "../v1/ludwig/type.js";
import type * as v1_product_constant from "../v1/product/constant.js";
import type * as v1_product_internal_query from "../v1/product/internal/query.js";
import type * as v1_product_iso_3166 from "../v1/product/iso/3166.js";
import type * as v1_product_iso_4217 from "../v1/product/iso/4217.js";
import type * as v1_product_model from "../v1/product/model.js";
import type * as v1_product_mutation from "../v1/product/mutation.js";
import type * as v1_product_query from "../v1/product/query.js";
import type * as v1_product_table from "../v1/product/table.js";
import type * as v1_product_type from "../v1/product/type.js";
import type * as v1_product_util from "../v1/product/util.js";
import type * as v1_product_validator from "../v1/product/validator.js";
import type * as v1_product_vendor_model from "../v1/product/vendor/model.js";
import type * as v1_product_vendor_mutation from "../v1/product/vendor/mutation.js";
import type * as v1_product_vendor_table from "../v1/product/vendor/table.js";
import type * as v1_product_vendor_validator from "../v1/product/vendor/validator.js";
import type * as v1_user_model from "../v1/user/model.js";
import type * as v1_user_mutation from "../v1/user/mutation.js";
import type * as v1_user_permission_constant from "../v1/user/permission/constant.js";
import type * as v1_user_permission_model from "../v1/user/permission/model.js";
import type * as v1_user_permission_table from "../v1/user/permission/table.js";
import type * as v1_user_permission_type from "../v1/user/permission/type.js";
import type * as v1_user_permission_validator from "../v1/user/permission/validator.js";
import type * as v1_user_query from "../v1/user/query.js";
import type * as v1_user_table from "../v1/user/table.js";
import type * as v1_user_validator from "../v1/user/validator.js";
import type * as v1_workspace_asset_http_action from "../v1/workspace/asset/http/action.js";
import type * as v1_workspace_asset_internal_mutation from "../v1/workspace/asset/internal/mutation.js";
import type * as v1_workspace_asset_model from "../v1/workspace/asset/model.js";
import type * as v1_workspace_asset_query from "../v1/workspace/asset/query.js";
import type * as v1_workspace_asset_table from "../v1/workspace/asset/table.js";
import type * as v1_workspace_asset_validator from "../v1/workspace/asset/validator.js";
import type * as v1_workspace_model from "../v1/workspace/model.js";
import type * as v1_workspace_query from "../v1/workspace/query.js";
import type * as v1_workspace_table from "../v1/workspace/table.js";
import type * as validator from "../validator.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  "config/cloudflare": typeof config_cloudflare;
  "config/google": typeof config_google;
  "config/openai": typeof config_openai;
  "config/resend": typeof config_resend;
  "config/x": typeof config_x;
  constant: typeof constant;
  "email/internal/action": typeof email_internal_action;
  http: typeof http;
  "middleware/authorization": typeof middleware_authorization;
  "middleware/http/authorization": typeof middleware_http_authorization;
  "middleware/internal/query": typeof middleware_internal_query;
  "response/error": typeof response_error;
  "response/success": typeof response_success;
  type: typeof type;
  "util/array": typeof util_array;
  "util/async": typeof util_async;
  "util/date": typeof util_date;
  "util/error": typeof util_error;
  "util/fetch": typeof util_fetch;
  "util/file": typeof util_file;
  "util/generator": typeof util_generator;
  "util/number": typeof util_number;
  "util/object": typeof util_object;
  "util/r2": typeof util_r2;
  "v1/auth/email/otp": typeof v1_auth_email_otp;
  "v1/auth/http/action": typeof v1_auth_http_action;
  "v1/auth/model": typeof v1_auth_model;
  "v1/auth/mutation": typeof v1_auth_mutation;
  "v1/auth/scheduler": typeof v1_auth_scheduler;
  "v1/auth/table": typeof v1_auth_table;
  "v1/auth/type": typeof v1_auth_type;
  "v1/cart/model": typeof v1_cart_model;
  "v1/cart/mutation": typeof v1_cart_mutation;
  "v1/cart/query": typeof v1_cart_query;
  "v1/cart/table": typeof v1_cart_table;
  "v1/cart/validator": typeof v1_cart_validator;
  "v1/chat/internal/mutation": typeof v1_chat_internal_mutation;
  "v1/chat/internal/query": typeof v1_chat_internal_query;
  "v1/chat/model": typeof v1_chat_model;
  "v1/chat/mutation": typeof v1_chat_mutation;
  "v1/chat/query": typeof v1_chat_query;
  "v1/chat/table": typeof v1_chat_table;
  "v1/chat/util": typeof v1_chat_util;
  "v1/chat/validator": typeof v1_chat_validator;
  "v1/design/constant": typeof v1_design_constant;
  "v1/design/internal/action": typeof v1_design_internal_action;
  "v1/design/internal/mutation": typeof v1_design_internal_mutation;
  "v1/design/internal/query": typeof v1_design_internal_query;
  "v1/design/model": typeof v1_design_model;
  "v1/design/mutation": typeof v1_design_mutation;
  "v1/design/query": typeof v1_design_query;
  "v1/design/table": typeof v1_design_table;
  "v1/design/type": typeof v1_design_type;
  "v1/design/validator": typeof v1_design_validator;
  "v1/ludwig/ai/agent": typeof v1_ludwig_ai_agent;
  "v1/ludwig/ai/tool/design": typeof v1_ludwig_ai_tool_design;
  "v1/ludwig/ai/tool/product": typeof v1_ludwig_ai_tool_product;
  "v1/ludwig/ai/tool/recommendation": typeof v1_ludwig_ai_tool_recommendation;
  "v1/ludwig/ai/tool/ui": typeof v1_ludwig_ai_tool_ui;
  "v1/ludwig/ai/util": typeof v1_ludwig_ai_util;
  "v1/ludwig/http/action": typeof v1_ludwig_http_action;
  "v1/ludwig/internal/mutation": typeof v1_ludwig_internal_mutation;
  "v1/ludwig/internal/query": typeof v1_ludwig_internal_query;
  "v1/ludwig/model": typeof v1_ludwig_model;
  "v1/ludwig/table": typeof v1_ludwig_table;
  "v1/ludwig/type": typeof v1_ludwig_type;
  "v1/product/constant": typeof v1_product_constant;
  "v1/product/internal/query": typeof v1_product_internal_query;
  "v1/product/iso/3166": typeof v1_product_iso_3166;
  "v1/product/iso/4217": typeof v1_product_iso_4217;
  "v1/product/model": typeof v1_product_model;
  "v1/product/mutation": typeof v1_product_mutation;
  "v1/product/query": typeof v1_product_query;
  "v1/product/table": typeof v1_product_table;
  "v1/product/type": typeof v1_product_type;
  "v1/product/util": typeof v1_product_util;
  "v1/product/validator": typeof v1_product_validator;
  "v1/product/vendor/model": typeof v1_product_vendor_model;
  "v1/product/vendor/mutation": typeof v1_product_vendor_mutation;
  "v1/product/vendor/table": typeof v1_product_vendor_table;
  "v1/product/vendor/validator": typeof v1_product_vendor_validator;
  "v1/user/model": typeof v1_user_model;
  "v1/user/mutation": typeof v1_user_mutation;
  "v1/user/permission/constant": typeof v1_user_permission_constant;
  "v1/user/permission/model": typeof v1_user_permission_model;
  "v1/user/permission/table": typeof v1_user_permission_table;
  "v1/user/permission/type": typeof v1_user_permission_type;
  "v1/user/permission/validator": typeof v1_user_permission_validator;
  "v1/user/query": typeof v1_user_query;
  "v1/user/table": typeof v1_user_table;
  "v1/user/validator": typeof v1_user_validator;
  "v1/workspace/asset/http/action": typeof v1_workspace_asset_http_action;
  "v1/workspace/asset/internal/mutation": typeof v1_workspace_asset_internal_mutation;
  "v1/workspace/asset/model": typeof v1_workspace_asset_model;
  "v1/workspace/asset/query": typeof v1_workspace_asset_query;
  "v1/workspace/asset/table": typeof v1_workspace_asset_table;
  "v1/workspace/asset/validator": typeof v1_workspace_asset_validator;
  "v1/workspace/model": typeof v1_workspace_model;
  "v1/workspace/query": typeof v1_workspace_query;
  "v1/workspace/table": typeof v1_workspace_table;
  validator: typeof validator;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
};
