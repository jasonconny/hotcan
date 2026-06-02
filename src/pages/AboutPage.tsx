import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function AboutPage() {
  useDocumentTitle('About');
  return (
    <div>
      <h1>About Hot Can</h1>
      <p>
        Two DJ’s and four turntables. Available for art openings, loft parties, club dates
        and bar mitzvahs. Hot Can is Jason Conny and Xavier Jimenez. Xavier Jimenez and
        Jason Conny are Hot Can.
      </p>
    </div>
  );
}
