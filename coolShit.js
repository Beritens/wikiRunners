function impact(textNode, index, n) {
    var text = textNode.nodeValue;
    var enSpace = "\u2002\u2002".repeat(n); // Unicode code point for en space character

    var txt2 = text.slice(0, Math.max(index-n,0)) + enSpace + text.slice(Math.max(index+n,0));
    textNode.nodeValue = txt2;
  }