export function getHTML({ title, body }: { title: string; body: string }): string {
  return `
  <html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    ${body}
  </body>
  </html>
  `;
}
