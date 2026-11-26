
function Header() {
  return (
    <header className="enterprise-header">
      <div>
        <span className="header-breadcrumb">MDMS / Enterprise</span>
        <h1>Enterprise Portal</h1>
      </div>

      <div className="header-profile">
        <div className="profile-avatar">E</div>
        <div className="profile-details">
          <strong>Enterprise Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
