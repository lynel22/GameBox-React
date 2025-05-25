
const SteamLoginButton = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const returnUrl = encodeURIComponent(`${frontendUrl}/auth/steam/callback`);

  const steamRedirectUrl = `https://steamcommunity.com/openid/login?` +
    `openid.ns=http://specs.openid.net/auth/2.0&` +
    `openid.mode=checkid_setup&` +
    `openid.return_to=${returnUrl}&` +
    `openid.realm=${frontendUrl}/&` +
    `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
    `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

  return (
    <a href={steamRedirectUrl}>
      <button>Iniciar sesión con Steam</button>
    </a>
  );
};

export default SteamLoginButton;
