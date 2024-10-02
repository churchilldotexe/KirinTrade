import MillionLint from "@million/lint";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {};
export default MillionLint.next({
  rsc: true,
})(config);

const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;
