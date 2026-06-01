import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Uh Oh!');
  return (
    <div>
      <h1>Uh Oh!</h1>
      <p>
        We couldn't find what you were looking for. Fat Thumbs Ronnie probably misplaced
        it. Why don't you check out the <Link to="/all">full list of episodes</Link>, maybe
        you can find it there.
      </p>
    </div>
  );
}
