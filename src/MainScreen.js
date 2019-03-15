class MainScreen
{

constructor() {}

init()
{
      //  Initialise the canvas
      projNS.proj.canvas = document.createElement("canvas");
      projNS.proj.canvas.id = 'mycanvas';
      projNS.proj.canvas.width = (64 * 16)*4;
      projNS.proj.canvas.height = (64 * 13)*5;
      projNS.proj.ctx = projNS.proj.canvas.getContext("2d");
      document.body.appendChild(projNS.proj.canvas);
      projNS.proj.num;

      console.log(projNS.proj.num);
  }

update()
{
  this.objAlgorithim();
}

objAlgorithim()
{
  // for loop
  //indexs through the array of jsson data from API
  //stores all data with x attribute in new variable
  // loop through this variable now.
}

}
