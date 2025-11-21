import { Document, Page } from 'react-pdf';

// inside component:
<Document file="/src/assets/pdfs/Udbhav202501.pdf">
  <Page pageNumber={1} width={400} />
  <Page pageNumber={2} width={400} />
  {/* … */}
</Document>
