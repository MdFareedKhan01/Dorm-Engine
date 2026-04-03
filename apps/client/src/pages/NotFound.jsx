import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="center-screen">
      <div className="card w-420 center-text">
        <h2>Page not found</h2>
        <p className="small-muted mt-8">The route you are trying to open does not exist.</p>
        <Link className="btn mt-20 inline-flex" to="/">Back to dashboard</Link>
      </div>
    </div>
  );
}
