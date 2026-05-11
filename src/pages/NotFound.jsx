import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';

export default function NotFound() {
  return (
    <main className="not-found">
      <Seo
        title="Page Not Found"
        description="The page you were looking for doesn't exist. Try one of the popular sections below."
        noindex
      />
      <h1>404 — Page Not Found</h1>
      <p>The page you were looking for doesn't exist or has moved.</p>
      <p>Try one of these popular sections:</p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/training/ppl">Training</Link></li>
        <li><Link to="/sales/new">Aircraft Sales</Link></li>
        <li><Link to="/expeditions">Expeditions</Link></li>
        <li><Link to="/blog">Blog</Link></li>
      </ul>
    </main>
  );
}
