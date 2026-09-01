import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-B0HIM6lB.js
var supabaseUrl = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_kdPifU-Jc9XP4jXOYxQorw_8tERsdDW",
	"VITE_SUPABASE_URL": "https://mcouxfhpjfkthjffldhv.supabase.co"
}["VITE_SUPABASE_URL"];
var supabasePublishableKey = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_kdPifU-Jc9XP4jXOYxQorw_8tERsdDW",
	"VITE_SUPABASE_URL": "https://mcouxfhpjfkthjffldhv.supabase.co"
}["VITE_SUPABASE_PUBLISHABLE_KEY"];
if (!supabaseUrl || !supabasePublishableKey) throw new Error("Variáveis do Supabase não configuradas.");
var supabase = createClient(supabaseUrl, supabasePublishableKey);
//#endregion
export { supabase as t };
