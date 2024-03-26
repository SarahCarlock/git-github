// https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
// https://stackoverflow.com/questions/69119798/react-markdown-links-dont-open-in-a-new-tab-despite-using-target-blank/69120400

export default function MarkdownLinkRenderer({href, children}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}