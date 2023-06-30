import fs from "fs";
import { getHTML } from "./utils";

enum TokenType {
  Head = "Head",
  CloseHead = "CloseHead",
  Subhead = "Subhead",
  CloseSubhead = "CloseSubhead",
  Image = "Image",
  CloseImage = "CloseImage",
  UnorderedList = "UnorderedList",
  CloseUnorderedList = "CloseUnorderedList",
  OrderedList = "OrderedList",
  CloseOrderedList = "CloseOrderedList",
  ListItem = "ListItem",
  CloseListItem = "CloseListItem",
  Bold = "Bold",
  CloseBold = "CloseBold",
  Italic = "Italic",
  CloseItalic = "CloseItalic",
  Underline = "Underline",
  CloseUnderline = "CloseUnderline",
  Strike = "Strike",
  CloseStrike = "CloseStrike",
  CodeBlock = "CodeBlock",
  CloseCodeBlock = "CloseCodeBlock",
  Text = "Text",
  NewLine = "NewLine",
  Eof = "Eof",
}

class Token {
  type: TokenType;
  value: string;

  constructor(type: TokenType, value: string) {
    this.type = type;
    this.value = value;
  }
}

const Keywords: { [key: string]: TokenType } = {
  ".h": TokenType.Head,
  "..h": TokenType.CloseHead,
  ".sh": TokenType.Subhead,
  "..sh": TokenType.CloseSubhead,
  ".img": TokenType.Image,
  "..img": TokenType.CloseImage,
  ".ul": TokenType.UnorderedList,
  "..ul": TokenType.CloseUnorderedList,
  ".ol": TokenType.OrderedList,
  "..ol": TokenType.CloseOrderedList,
  ".li": TokenType.ListItem,
  "..li": TokenType.CloseListItem,
  ".b": TokenType.Bold,
  "..b": TokenType.CloseBold,
  ".i": TokenType.Italic,
  "..i": TokenType.CloseItalic,
  ".u": TokenType.Underline,
  "..u": TokenType.CloseUnderline,
  ".s": TokenType.Strike,
  "..s": TokenType.CloseStrike,
  ".cb": TokenType.CodeBlock,
  "..cb": TokenType.CloseCodeBlock,
  ".nl": TokenType.NewLine,
  ".eof": TokenType.Eof,
};

const GetHtmlTag = (token: Token) => {
  switch (token.type) {
    case TokenType.Head:
      return "<h1>";
    case TokenType.CloseHead:
      return "</h1>";
    case TokenType.Subhead:
      return "<h2>";
    case TokenType.CloseSubhead:
      return "</h2>";
    case TokenType.Image:
      return "<img>";
    case TokenType.CloseImage:
      return "</img>";
    case TokenType.UnorderedList:
      return "<ul>";
    case TokenType.CloseUnorderedList:
      return "</ul>";
    case TokenType.OrderedList:
      return "<ol>";
    case TokenType.CloseOrderedList:
      return "</ol>";
    case TokenType.ListItem:
      return "<li>";
    case TokenType.CloseListItem:
      return "</li>";
    case TokenType.Bold:
      return "<b>";
    case TokenType.CloseBold:
      return "</b>";
    case TokenType.Italic:
      return "<i>";
    case TokenType.CloseItalic:
      return "</i>";
    case TokenType.Underline:
      return "<u>";
    case TokenType.CloseUnderline:
      return "</u>";
    case TokenType.Strike:
      return "<s>";
    case TokenType.CloseStrike:
      return "</s>";
    case TokenType.CodeBlock:
      return "<code>";
    case TokenType.CloseCodeBlock:
      return "</code>";
    case TokenType.NewLine:
      return "<br>";
    case TokenType.Eof:
      return " ";
    default:
      return token.value;
  }
};

class Lexer {
  source: string;
  current: number = 0;
  peak: number = 0;
  constructor(source: string) {
    this.source = source;
  }
  next() {
    this.current = this.peak;
    this.peak++;
    return this.source[this.current];
  }
  peakNext() {
    return this.source[this.peak];
  }
  lex(): Token[] {
    const tokens: Token[] = [];
    this.source.split(/\s/).forEach((word) => {
      if (word === "") {
        return;
      }
      if (Keywords[word]) {
        tokens.push(new Token(Keywords[word], word));
        return;
      }
      tokens.push(new Token(TokenType.Text, word + " "));
    });
    return tokens;
  }
}

class Parser {
  tokens: Token[] = [];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse() {
    let html = "";
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      html += GetHtmlTag(token);
    }
    return html;
  }
}

function main() {
  const source = fs.readFileSync("./test.txt", "utf-8");
  const lexer = new Lexer(source);
  const tokens = lexer.lex();
  const parser = new Parser(tokens);
  const htmlBody = parser.parse();
  fs.writeFileSync(
    "./generated/index.html",
    getHTML({ title: "Test", body: htmlBody })
  );
}

main();
