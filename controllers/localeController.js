const INACTIVITY_EXPIRATION_30_DAYS = 1000 * 60 * 60 * 24 * 30;

function changeLocale(req, res, next) {
  const locale = req.params.locale;

  res.cookie("nodeapp-locale", locale, {
    maxAge: INACTIVITY_EXPIRATION_30_DAYS,
  });

  res.redirect(req.get("Referrer") || "/");
}

export default changeLocale;
