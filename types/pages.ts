export interface PageComponent {
  (...args: any[]): JSX.Element
  getInitialProps?: (...args: any[]) => any
}
