/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as constant from "../constant.js";
import type * as email_service from "../email/service.js";
import type * as http from "../http.js";
import type * as middleware_authorization from "../middleware/authorization.js";
import type * as response_error from "../response/error.js";
import type * as response_success from "../response/success.js";
import type * as type from "../type.js";
import type * as util_date from "../util/date.js";
import type * as util_generator from "../util/generator.js";
import type * as v1_auth_email_otp from "../v1/auth/email/otp.js";
import type * as v1_auth_httpAction from "../v1/auth/httpAction.js";
import type * as v1_auth_model from "../v1/auth/model.js";
import type * as v1_auth_mutation from "../v1/auth/mutation.js";
import type * as v1_auth_scheduler from "../v1/auth/scheduler.js";
import type * as v1_auth_table from "../v1/auth/table.js";
import type * as v1_auth_type from "../v1/auth/type.js";
import type * as v1_user_model from "../v1/user/model.js";
import type * as v1_user_mutation from "../v1/user/mutation.js";
import type * as v1_user_permission_constant from "../v1/user/permission/constant.js";
import type * as v1_user_permission_model from "../v1/user/permission/model.js";
import type * as v1_user_permission_table from "../v1/user/permission/table.js";
import type * as v1_user_permission_type from "../v1/user/permission/type.js";
import type * as v1_user_permission_validator from "../v1/user/permission/validator.js";
import type * as v1_user_query from "../v1/user/query.js";
import type * as v1_user_table from "../v1/user/table.js";
import type * as v1_user_type from "../v1/user/type.js";
import type * as v1_user_validator from "../v1/user/validator.js";
import type * as v1_workspace_model from "../v1/workspace/model.js";
import type * as v1_workspace_query from "../v1/workspace/query.js";
import type * as v1_workspace_table from "../v1/workspace/table.js";

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
  constant: typeof constant;
  "email/service": typeof email_service;
  http: typeof http;
  "middleware/authorization": typeof middleware_authorization;
  "response/error": typeof response_error;
  "response/success": typeof response_success;
  type: typeof type;
  "util/date": typeof util_date;
  "util/generator": typeof util_generator;
  "v1/auth/email/otp": typeof v1_auth_email_otp;
  "v1/auth/httpAction": typeof v1_auth_httpAction;
  "v1/auth/model": typeof v1_auth_model;
  "v1/auth/mutation": typeof v1_auth_mutation;
  "v1/auth/scheduler": typeof v1_auth_scheduler;
  "v1/auth/table": typeof v1_auth_table;
  "v1/auth/type": typeof v1_auth_type;
  "v1/user/model": typeof v1_user_model;
  "v1/user/mutation": typeof v1_user_mutation;
  "v1/user/permission/constant": typeof v1_user_permission_constant;
  "v1/user/permission/model": typeof v1_user_permission_model;
  "v1/user/permission/table": typeof v1_user_permission_table;
  "v1/user/permission/type": typeof v1_user_permission_type;
  "v1/user/permission/validator": typeof v1_user_permission_validator;
  "v1/user/query": typeof v1_user_query;
  "v1/user/table": typeof v1_user_table;
  "v1/user/type": typeof v1_user_type;
  "v1/user/validator": typeof v1_user_validator;
  "v1/workspace/model": typeof v1_workspace_model;
  "v1/workspace/query": typeof v1_workspace_query;
  "v1/workspace/table": typeof v1_workspace_table;
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
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      createManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          replyTo?: Array<string>;
          subject: string;
          to: string;
        },
        string
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          createdAt: number;
          errorMessage?: string;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject: string;
          text?: string;
          to: string;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          complained: boolean;
          errorMessage: string | null;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject: string;
          text?: string;
          to: string;
        },
        string
      >;
      updateManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          emailId: string;
          errorMessage?: string;
          resendId?: string;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        },
        null
      >;
    };
  };
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
