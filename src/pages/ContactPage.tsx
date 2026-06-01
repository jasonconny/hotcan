import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function ContactPage() {
  useDocumentTitle('Contact');
  return (
    <div>
      <h1>Contact</h1>
      <p>email: thedirtyhunch[at]hotcan[dot]info</p>
    </div>
  );
}
