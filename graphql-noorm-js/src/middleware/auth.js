/** Middleware for handling req authorization for routes. */
import AuthHandling from "../helpers/authHandling";

/** Middleware: Add JWT to the request body if exists. */
function processJWT(req, res, next) {
  try {
    const payload = AuthHandling.validateCookies(req);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
};

/** Middleware: Requires user is authenticated. */
function checkLoggedIn(req, res, next) {
  try {
    if (req.user.id) {
      return next();
    }
    return next({ status: 401, message: "Unauthorized" });
  } catch (error) {
    return next({ status: 401, message: "Unauthorized" });
  }
};


/** Middleware: Check User Permission vs. User ID 
 * 
 * User Types
 *  ---- Basic Users -----
 *  - Authenticated
 *  - Validated
 *  ---- Paid Users -----
 *  - Tier1 (Paid Tier)
 *  - Tier2 (Paid Tier)
 *  ---- Site Management ----
 *  - SiteModerator
 *  - SiteAdmin
 *  ---- Independent Contributors ----
 *  - IndependentAuthor
 *  - IndependentPublisher
 *  - IndependentAdmin
 *  ---- Corporate Contributors ----
 *  - CorporateAuthor
 *  - CorporatePublisher
 *  - CorporateAdmin
*/
function validateIsAuthorized(req, res, next) {
  try {
    if (req.user.id === +req.params.id && req.user.type === "user") {
      return next();
    }

    return next({ status: 401, message: "Unauthorized" });
  } catch (err) {
    return next({ status: 401, message: "Unauthorized" });
  }
};

export {
  processJWT,
  checkLoggedIn,
  validateIsAuthorized
};