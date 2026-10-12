import './SiteFooter.css'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>Made for little voices with big things to say. <span aria-hidden="true">♡</span></p>
      <p className="disclaimer"><strong>Important note:</strong> The games, stories, and activities on msjana.com and mrsjana.com are designed for educational enrichment, practice, and play. They are intended to support language exploration and do not constitute a formal speech-language pathology evaluation, diagnosis, or clinical treatment. This is an independent site, not affiliated with any school or district. Please play together, and talk with your child’s speech-language pathologist or another qualified professional about any concerns.</p>
      <p className="footer-links"><a href="#/grown-ups">Notes for grown-ups: privacy, microphone & safety</a> · © {new Date().getFullYear()} Ms. Jana</p>
    </footer>
  )
}
