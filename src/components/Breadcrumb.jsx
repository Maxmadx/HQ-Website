import { Link, useLocation } from 'react-router-dom';
import { getBreadcrumbs } from '../config/routes';

function Breadcrumb() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <div className="container">
        <ol className="breadcrumb__list">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.path} className="breadcrumb__item">
                {!isLast ? (
                  <>
                    <Link to={crumb.path} className="breadcrumb__link">
                      {index === 0 ? (
                        <i className="fas fa-home" aria-hidden="true"></i>
                      ) : (
                        crumb.title
                      )}
                    </Link>
                    <span className="breadcrumb__separator" aria-hidden="true">
                      <i className="fas fa-chevron-right"></i>
                    </span>
                  </>
                ) : (
                  <span className="breadcrumb__current" aria-current="page">
                    {crumb.title}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumb;
