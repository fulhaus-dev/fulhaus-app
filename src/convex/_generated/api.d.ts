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
import type * as config_anthropic from "../config/anthropic.js";
import type * as config_cloudflare from "../config/cloudflare.js";
import type * as config_google from "../config/google.js";
import type * as config_openai from "../config/openai.js";
import type * as config_replicate from "../config/replicate.js";
import type * as config_resend from "../config/resend.js";
import type * as config_stripe from "../config/stripe.js";
import type * as constant from "../constant.js";
import type * as email_internal_action from "../email/internal/action.js";
import type * as http from "../http.js";
import type * as middleware_authorization from "../middleware/authorization.js";
import type * as middleware_cors from "../middleware/cors.js";
import type * as middleware_http_authorization from "../middleware/http/authorization.js";
import type * as middleware_internal_query from "../middleware/internal/query.js";
import type * as response_error from "../response/error.js";
import type * as response_success from "../response/success.js";
import type * as response_validator from "../response/validator.js";
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
import type * as v1_cart_internal_mutation from "../v1/cart/internal/mutation.js";
import type * as v1_cart_internal_query from "../v1/cart/internal/query.js";
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
import type * as v1_design_log_model from "../v1/design/log/model.js";
import type * as v1_design_log_query from "../v1/design/log/query.js";
import type * as v1_design_log_table from "../v1/design/log/table.js";
import type * as v1_design_log_validator from "../v1/design/log/validator.js";
import type * as v1_design_model from "../v1/design/model.js";
import type * as v1_design_mutation from "../v1/design/mutation.js";
import type * as v1_design_query from "../v1/design/query.js";
import type * as v1_design_table from "../v1/design/table.js";
import type * as v1_design_tag_internal_mutation from "../v1/design/tag/internal/mutation.js";
import type * as v1_design_tag_model from "../v1/design/tag/model.js";
import type * as v1_design_tag_mutation from "../v1/design/tag/mutation.js";
import type * as v1_design_tag_query from "../v1/design/tag/query.js";
import type * as v1_design_tag_table from "../v1/design/tag/table.js";
import type * as v1_design_type from "../v1/design/type.js";
import type * as v1_design_util from "../v1/design/util.js";
import type * as v1_design_validator from "../v1/design/validator.js";
import type * as v1_ludwig_ai_agent from "../v1/ludwig/ai/agent.js";
import type * as v1_ludwig_ai_tool_design from "../v1/ludwig/ai/tool/design.js";
import type * as v1_ludwig_ai_tool_internal_mutation from "../v1/ludwig/ai/tool/internal/mutation.js";
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
import type * as v1_order_internal_action from "../v1/order/internal/action.js";
import type * as v1_order_internal_mutation from "../v1/order/internal/mutation.js";
import type * as v1_order_internal_query from "../v1/order/internal/query.js";
import type * as v1_order_model from "../v1/order/model.js";
import type * as v1_order_table from "../v1/order/table.js";
import type * as v1_order_validator from "../v1/order/validator.js";
import type * as v1_payment_action from "../v1/payment/action.js";
import type * as v1_payment_constant from "../v1/payment/constant.js";
import type * as v1_payment_internal_action from "../v1/payment/internal/action.js";
import type * as v1_payment_model from "../v1/payment/model.js";
import type * as v1_payment_stripe from "../v1/payment/stripe.js";
import type * as v1_payment_type from "../v1/payment/type.js";
import type * as v1_payment_validator from "../v1/payment/validator.js";
import type * as v1_product_constant from "../v1/product/constant.js";
import type * as v1_product_embedding_internal_query from "../v1/product/embedding/internal/query.js";
import type * as v1_product_embedding_model from "../v1/product/embedding/model.js";
import type * as v1_product_embedding_table from "../v1/product/embedding/table.js";
import type * as v1_product_embedding_validator from "../v1/product/embedding/validator.js";
import type * as v1_product_error_model from "../v1/product/error/model.js";
import type * as v1_product_error_mutation from "../v1/product/error/mutation.js";
import type * as v1_product_error_table from "../v1/product/error/table.js";
import type * as v1_product_http_action from "../v1/product/http/action.js";
import type * as v1_product_internal_action from "../v1/product/internal/action.js";
import type * as v1_product_internal_mutation from "../v1/product/internal/mutation.js";
import type * as v1_product_internal_query from "../v1/product/internal/query.js";
import type * as v1_product_internal_sharp from "../v1/product/internal/sharp.js";
import type * as v1_product_model from "../v1/product/model.js";
import type * as v1_product_mutation from "../v1/product/mutation.js";
import type * as v1_product_query from "../v1/product/query.js";
import type * as v1_product_statistics_model from "../v1/product/statistics/model.js";
import type * as v1_product_statistics_query from "../v1/product/statistics/query.js";
import type * as v1_product_statistics_table from "../v1/product/statistics/table.js";
import type * as v1_product_statistics_trigger from "../v1/product/statistics/trigger.js";
import type * as v1_product_table from "../v1/product/table.js";
import type * as v1_product_type from "../v1/product/type.js";
import type * as v1_product_util from "../v1/product/util.js";
import type * as v1_product_validator from "../v1/product/validator.js";
import type * as v1_product_vendor_model from "../v1/product/vendor/model.js";
import type * as v1_product_vendor_mutation from "../v1/product/vendor/mutation.js";
import type * as v1_product_vendor_table from "../v1/product/vendor/table.js";
import type * as v1_product_vendor_validator from "../v1/product/vendor/validator.js";
import type * as v1_user_internal_query from "../v1/user/internal/query.js";
import type * as v1_user_model from "../v1/user/model.js";
import type * as v1_user_mutation from "../v1/user/mutation.js";
import type * as v1_user_permission_constant from "../v1/user/permission/constant.js";
import type * as v1_user_permission_model from "../v1/user/permission/model.js";
import type * as v1_user_permission_table from "../v1/user/permission/table.js";
import type * as v1_user_permission_type from "../v1/user/permission/type.js";
import type * as v1_user_permission_validator from "../v1/user/permission/validator.js";
import type * as v1_user_query from "../v1/user/query.js";
import type * as v1_user_stripe_internal_mutation from "../v1/user/stripe/internal/mutation.js";
import type * as v1_user_stripe_internal_query from "../v1/user/stripe/internal/query.js";
import type * as v1_user_stripe_model from "../v1/user/stripe/model.js";
import type * as v1_user_stripe_table from "../v1/user/stripe/table.js";
import type * as v1_user_table from "../v1/user/table.js";
import type * as v1_user_validator from "../v1/user/validator.js";
import type * as v1_workspace_asset_http_action from "../v1/workspace/asset/http/action.js";
import type * as v1_workspace_asset_internal_mutation from "../v1/workspace/asset/internal/mutation.js";
import type * as v1_workspace_asset_model from "../v1/workspace/asset/model.js";
import type * as v1_workspace_asset_query from "../v1/workspace/asset/query.js";
import type * as v1_workspace_asset_table from "../v1/workspace/asset/table.js";
import type * as v1_workspace_asset_validator from "../v1/workspace/asset/validator.js";
import type * as v1_workspace_model from "../v1/workspace/model.js";
import type * as v1_workspace_plan_constant from "../v1/workspace/plan/constant.js";
import type * as v1_workspace_plan_internal_action from "../v1/workspace/plan/internal/action.js";
import type * as v1_workspace_plan_internal_mutation from "../v1/workspace/plan/internal/mutation.js";
import type * as v1_workspace_plan_internal_query from "../v1/workspace/plan/internal/query.js";
import type * as v1_workspace_plan_model from "../v1/workspace/plan/model.js";
import type * as v1_workspace_plan_query from "../v1/workspace/plan/query.js";
import type * as v1_workspace_plan_table from "../v1/workspace/plan/table.js";
import type * as v1_workspace_plan_type from "../v1/workspace/plan/type.js";
import type * as v1_workspace_plan_validator from "../v1/workspace/plan/validator.js";
import type * as v1_workspace_query from "../v1/workspace/query.js";
import type * as v1_workspace_table from "../v1/workspace/table.js";
import type * as v1_workspace_validator from "../v1/workspace/validator.js";
import type * as validator from "../validator.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  "config/anthropic": typeof config_anthropic;
  "config/cloudflare": typeof config_cloudflare;
  "config/google": typeof config_google;
  "config/openai": typeof config_openai;
  "config/replicate": typeof config_replicate;
  "config/resend": typeof config_resend;
  "config/stripe": typeof config_stripe;
  constant: typeof constant;
  "email/internal/action": typeof email_internal_action;
  http: typeof http;
  "middleware/authorization": typeof middleware_authorization;
  "middleware/cors": typeof middleware_cors;
  "middleware/http/authorization": typeof middleware_http_authorization;
  "middleware/internal/query": typeof middleware_internal_query;
  "response/error": typeof response_error;
  "response/success": typeof response_success;
  "response/validator": typeof response_validator;
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
  "v1/cart/internal/mutation": typeof v1_cart_internal_mutation;
  "v1/cart/internal/query": typeof v1_cart_internal_query;
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
  "v1/design/log/model": typeof v1_design_log_model;
  "v1/design/log/query": typeof v1_design_log_query;
  "v1/design/log/table": typeof v1_design_log_table;
  "v1/design/log/validator": typeof v1_design_log_validator;
  "v1/design/model": typeof v1_design_model;
  "v1/design/mutation": typeof v1_design_mutation;
  "v1/design/query": typeof v1_design_query;
  "v1/design/table": typeof v1_design_table;
  "v1/design/tag/internal/mutation": typeof v1_design_tag_internal_mutation;
  "v1/design/tag/model": typeof v1_design_tag_model;
  "v1/design/tag/mutation": typeof v1_design_tag_mutation;
  "v1/design/tag/query": typeof v1_design_tag_query;
  "v1/design/tag/table": typeof v1_design_tag_table;
  "v1/design/type": typeof v1_design_type;
  "v1/design/util": typeof v1_design_util;
  "v1/design/validator": typeof v1_design_validator;
  "v1/ludwig/ai/agent": typeof v1_ludwig_ai_agent;
  "v1/ludwig/ai/tool/design": typeof v1_ludwig_ai_tool_design;
  "v1/ludwig/ai/tool/internal/mutation": typeof v1_ludwig_ai_tool_internal_mutation;
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
  "v1/order/internal/action": typeof v1_order_internal_action;
  "v1/order/internal/mutation": typeof v1_order_internal_mutation;
  "v1/order/internal/query": typeof v1_order_internal_query;
  "v1/order/model": typeof v1_order_model;
  "v1/order/table": typeof v1_order_table;
  "v1/order/validator": typeof v1_order_validator;
  "v1/payment/action": typeof v1_payment_action;
  "v1/payment/constant": typeof v1_payment_constant;
  "v1/payment/internal/action": typeof v1_payment_internal_action;
  "v1/payment/model": typeof v1_payment_model;
  "v1/payment/stripe": typeof v1_payment_stripe;
  "v1/payment/type": typeof v1_payment_type;
  "v1/payment/validator": typeof v1_payment_validator;
  "v1/product/constant": typeof v1_product_constant;
  "v1/product/embedding/internal/query": typeof v1_product_embedding_internal_query;
  "v1/product/embedding/model": typeof v1_product_embedding_model;
  "v1/product/embedding/table": typeof v1_product_embedding_table;
  "v1/product/embedding/validator": typeof v1_product_embedding_validator;
  "v1/product/error/model": typeof v1_product_error_model;
  "v1/product/error/mutation": typeof v1_product_error_mutation;
  "v1/product/error/table": typeof v1_product_error_table;
  "v1/product/http/action": typeof v1_product_http_action;
  "v1/product/internal/action": typeof v1_product_internal_action;
  "v1/product/internal/mutation": typeof v1_product_internal_mutation;
  "v1/product/internal/query": typeof v1_product_internal_query;
  "v1/product/internal/sharp": typeof v1_product_internal_sharp;
  "v1/product/model": typeof v1_product_model;
  "v1/product/mutation": typeof v1_product_mutation;
  "v1/product/query": typeof v1_product_query;
  "v1/product/statistics/model": typeof v1_product_statistics_model;
  "v1/product/statistics/query": typeof v1_product_statistics_query;
  "v1/product/statistics/table": typeof v1_product_statistics_table;
  "v1/product/statistics/trigger": typeof v1_product_statistics_trigger;
  "v1/product/table": typeof v1_product_table;
  "v1/product/type": typeof v1_product_type;
  "v1/product/util": typeof v1_product_util;
  "v1/product/validator": typeof v1_product_validator;
  "v1/product/vendor/model": typeof v1_product_vendor_model;
  "v1/product/vendor/mutation": typeof v1_product_vendor_mutation;
  "v1/product/vendor/table": typeof v1_product_vendor_table;
  "v1/product/vendor/validator": typeof v1_product_vendor_validator;
  "v1/user/internal/query": typeof v1_user_internal_query;
  "v1/user/model": typeof v1_user_model;
  "v1/user/mutation": typeof v1_user_mutation;
  "v1/user/permission/constant": typeof v1_user_permission_constant;
  "v1/user/permission/model": typeof v1_user_permission_model;
  "v1/user/permission/table": typeof v1_user_permission_table;
  "v1/user/permission/type": typeof v1_user_permission_type;
  "v1/user/permission/validator": typeof v1_user_permission_validator;
  "v1/user/query": typeof v1_user_query;
  "v1/user/stripe/internal/mutation": typeof v1_user_stripe_internal_mutation;
  "v1/user/stripe/internal/query": typeof v1_user_stripe_internal_query;
  "v1/user/stripe/model": typeof v1_user_stripe_model;
  "v1/user/stripe/table": typeof v1_user_stripe_table;
  "v1/user/table": typeof v1_user_table;
  "v1/user/validator": typeof v1_user_validator;
  "v1/workspace/asset/http/action": typeof v1_workspace_asset_http_action;
  "v1/workspace/asset/internal/mutation": typeof v1_workspace_asset_internal_mutation;
  "v1/workspace/asset/model": typeof v1_workspace_asset_model;
  "v1/workspace/asset/query": typeof v1_workspace_asset_query;
  "v1/workspace/asset/table": typeof v1_workspace_asset_table;
  "v1/workspace/asset/validator": typeof v1_workspace_asset_validator;
  "v1/workspace/model": typeof v1_workspace_model;
  "v1/workspace/plan/constant": typeof v1_workspace_plan_constant;
  "v1/workspace/plan/internal/action": typeof v1_workspace_plan_internal_action;
  "v1/workspace/plan/internal/mutation": typeof v1_workspace_plan_internal_mutation;
  "v1/workspace/plan/internal/query": typeof v1_workspace_plan_internal_query;
  "v1/workspace/plan/model": typeof v1_workspace_plan_model;
  "v1/workspace/plan/query": typeof v1_workspace_plan_query;
  "v1/workspace/plan/table": typeof v1_workspace_plan_table;
  "v1/workspace/plan/type": typeof v1_workspace_plan_type;
  "v1/workspace/plan/validator": typeof v1_workspace_plan_validator;
  "v1/workspace/query": typeof v1_workspace_query;
  "v1/workspace/table": typeof v1_workspace_table;
  "v1/workspace/validator": typeof v1_workspace_validator;
  validator: typeof validator;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
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
