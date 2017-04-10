// Name: Colin Phillips
// Id: 11357836

function Circle(x, y, vX, vY, r, color, infoObj)
{
    var c = document.getElementById("drawHere");
    var rect = c.getBoundingClientRect();

    this.x = x - rect.left;
    this.y = y - rect.top;
    this.radius = r;
    this.velocity = { x: vX, y: vY}
    this.color = color;
    this.info = infoObj;
}

Circle.prototype.draw = function()
{
    // Draw the circle with an arc and fill it in with its color.
    this.info.ctx.beginPath();
    this.info.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.info.ctx.strokeStyle = 'black';
    this.info.ctx.fillStyle = this.color;
    this.info.ctx.stroke();
    this.info.ctx.fill();
}

Circle.prototype.update = function()
{
    // Update cirles as per their velocity vectors
    if (this.x + this.radius >= this.info.width ||
        this.x - this.radius <= this.info.x)
    {
        // This circle is beyond the bounds of the left or right edge
        this.velocity.x *= -1;
    }

    if (this.y + this.radius >= this.info.height ||
        this.y - this.radius <= this.info.y)
    {
        // This circle is beyond the bounds of the top or bottom edge
        this.velocity.y *= -1;
    }

    // Advance the circle by their respective magnitude in X and Y directions.
    this.x += this.velocity.x;
    this.y += this.velocity.y;
}

function MovingCircle(x, y, color, info)
{
    // Get a random radius between 10 and 20.
    var r = Math.floor(Math.random() * 11) + 10;

    // Get random X and Y velocities between 1 and 5.
    var vX = Math.floor(Math.random() * 5) + 1;
    var vY = Math.floor(Math.random() * 5) + 1;

    // Randomly negate the above X and Y velocities
    if (Math.floor(Math.random() * 2) == 1) vX *= -1;
    if (Math.floor(Math.random() * 2) == 1) vY *= -1;

    // Inherit from the base circle class
    Circle.call(this, x, y, vX, vY, r, color, info);
}
MovingCircle.prototype = Object.create(Circle.prototype);

MovingCircle.prototype.checkCollision = function(statics)
{
    // Loop through all provided statics and see if this circle collide
    // with any of them.
    for (var i = 0; i < statics.length; i++)
    {
        var static = statics[i];

        // Credit: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#Circle_Collision
        var dx = this.x - static.x;
        var dy = this.y - static.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + static.radius)
        {
            // Collision; update velocity vectors
            this.velocity.x *= -1;
            this.velocity.y *= -1;
            break;
        }
    }
}

function StaticCircle(x, y, color, info)
{
    // Get a random radius between 20 and 40.
    var r = Math.floor(Math.random() * 21) + 20;

    // Inherit from the base circle class
    // A static circle will always have X and Y velocities as zero.
    Circle.call(this, x, y, 0, 0, r, color, info);
}
StaticCircle.prototype = Object.create(Circle.prototype);

StaticCircle.prototype.draw = function()
{
    // Draw the base cirle first
    Circle.prototype.draw.call(this);

    // A static circle needs an 'S' written inside of it.
    this.info.ctx.beginPath();
    this.info.ctx.fillStyle = 'black';
    this.info.ctx.font = 'bold 10px sans-serif';
    this.info.ctx.fillText("S", this.x - 3, this.y + 3);
    this.info.ctx.fill();
}
