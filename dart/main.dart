void main() {
  var bytes = stringToCodeList("0123456789abcdef");
  print("Hello world");
}

List<int> stringToCodeList(String str) {
  var bytes = str.codeUnits;
  List<int> result = List.generate(str.length ~/ 4, (i) => 0);
  for (int i = 0; i < result.length; i++) {
    result[i] = (bytes[i] << 24) |
        (bytes[i + 1] << 16) |
        (bytes[i + 2] << 8) |
        (bytes[i + 3]);
  }
  return result;
}
