var projNS = {}

function main() {
  // instantiate main screen
  // initialise all using
  // update all using global
  const project = new MainScreen();
  projNS.proj = project;
  projNS.proj.init();
  //projNS.proj.update();
  return 0;
}
