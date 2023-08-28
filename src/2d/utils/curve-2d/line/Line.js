

var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var GEOM_CONST = require('../const');
var Random = require('./Random');
const Vector2 = require('../Vector2');



class Line{

     constructor (x1, y1, x2, y2)
    {

    
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        
        this.type = GEOM_CONST.LINE;

        
        this.x1 = x1;

        
        this.y1 = y1;

        
        this.x2 = x2;

        
        this.y2 = y2;
    }

    
    getPoint(position, output)
    {
        return GetPoint(this, position, output);
    }

    
    getPoints(quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    
    getRandomPoint(point)
    {
        return Random(this, point);
    }

    
    setTo(x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        return this;
    }

    
    getPointA(vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x1, this.y1);

        return vec2;
    }

    
    getPointB(vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x2, this.y2);

        return vec2;
    }

    

    get left ()
    {
         return Math.min(this.x1, this.x2);
    }
    set left (value)
    {
        if (this.x1 <= this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }

   

    
    get right ()
    {
        return Math.max(this.x1, this.x2);
    }
    set right (value)
    {
        if (this.x1 > this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }
    

    

    get top ()
    {
        return Math.min(this.y1, this.y2);
    }

    set top (value)
    {
        if (this.y1 <= this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }

   

    
    get bottom ()
    {
        return Math.max(this.y1, this.y2);
    }

    set bottom (value)
    {
        if (this.y1 > this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }
  

};

module.exports = Line;
