import Document, {
  Head,
  Main,
  NextDocumentContext,
  NextScript,
} from 'next/document';
const sprite = require('svg-sprite-loader/runtime/sprite.build');

export default class CustomDocument extends Document<{
  spriteContent: string;
}> {
  public static async getInitialProps(ctx: NextDocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const spriteContent = sprite.stringify();

    return {
      spriteContent,
      ...initialProps,
    };
  }

  public render() {
    return (
      <html>
        <Head>
          <script
            data-ad-client="ca-pub-9972088947092730"
            async={true}
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          />
        </Head>
        <body>
          <div dangerouslySetInnerHTML={{ __html: this.props.spriteContent }} />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
