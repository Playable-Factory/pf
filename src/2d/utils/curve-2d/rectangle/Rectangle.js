

var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var GEOM_CONST = require('../const');
var Line = require('../line/Line');
var Random = require('./Random');


export default class Rectangle {

    constructor (x, y, width, height)
    { 
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        
        this.type = GEOM_CONST.RECTANGLE;

        
        this.x = x;

        
        this.y = y;

        
        this.width = width;

        
        this.height = height;
    }

    
    contains (x, y)
    {
        return Contains(this, x, y);
    }

    
    getPoint (position, output)
    {
        return GetPoint(this, position, output);
    }

    
    getPoints (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    
    getRandomPoint (point)
    {
        return Random(this, point);
    }

    
    setTo (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    }

    
    setEmpty ()
    {
        return this.setTo(0, 0, 0, 0);
    }

    
    setPosition (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

    
    setSize (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    }

    
    isEmpty ()
    {
        return (this.width <= 0 || this.height <= 0);
    }

    
    getLineA (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.y, this.right, this.y);

        return line;
    }

    
    getLineB (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.y, this.right, this.bottom);

        return line;
    }

    
    getLineC (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.bottom, this.x, this.bottom);

        return line;
    }

    
    getLineD (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.bottom, this.x, this.y);

        return line;
    }

    


    get left ()
    {
        return this.x;
    }

    set left (value)
    {
        if (value >= this.right)
        {
            this.width = 0;
        }
        else
        {
            this.width = this.right - value;
        }

        this.x = value;
    }
   

    
    get right ()
    {
        return this.x + this.width;
    }

    set right (value)
    {
        if (value <= this.x)
        {
            this.width = 0;
        }
        else
        {
            this.width = value - this.x;
        }
    }
   

    
    get top ()
    {
        return this.y;
    }
    set top (value)
    {
        if (value >= this.bottom)
        {
            this.height = 0;
        }
        else
        {
            this.height = (this.bottom - value);
        }

        this.y = value;
    }
  

    
    get bottom ()
    {
        return this.y + this.height;
    }
    set bottom (value)
    {
        if (value <= this.y)
        {
            this.height = 0;
        }
        else
        {
            this.height = value - this.y;
        }
    }
   

    
    get centerX ()
    {
        return this.x + (this.width / 2);
    }
    set centerX (value)
    {
        this.x = value - (this.width / 2);
    }
    

    
    get centerY ()
    {
        return this.y + (this.height / 2);
    }
    set centerY (value)
    {
        this.y = value - (this.height / 2);
    }
    

};

