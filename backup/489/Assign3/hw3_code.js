// Student name: Colin Phillips
// Student ID: 11357836

// Don't forget to include the .js file for the base class along with
// this one when submitting to Blackboard!

/*** Function object declaration for object Set489 ***/
function Set489(comparer)
{
    BST.call(this, comparer);
};

Set489.prototype = Object.create(BST.prototype);

Set489.prototype.add = function(val)
{
    if (val === null || val === undefined)
    {
        return false;
    }
    
    /* (1) Vall the base version of .add(val) */
    if (BST.prototype.add.call(this, val))
    {
        /* Mark this new node as RED */
        this.m_last.color = new Color();

        return this.balance(this.m_last);
    }
    
    return false;
};

Set489.prototype.balance = function(node)
{
    /* Is this node the root? */
    if (node === this.m_root)
    {
        /* Set the Color to black and return */
        node.color.setBlack();
        return true;
    }
    
    /* Is the node's parent black? */
    if (node.parent.color.isBlack()) { return true; }
    
    var p = node.parent;
    var g = this.getGrandparent(node);
    var u = this.getUncle(node);
    
    if (u !== null && u.color.isRed())
    {
        p.color.setBlack();
        u.color.setBlack();
        g.color.setRed();
        return this.balance(g);
    }
    
    /* Otherwise the uncle is black */
    if (p === g.left && node === p.right)
    {
        this.rotateLeft(p);
        node = node.left;
    }
    else if (p === g.right && node === p.left)
    {
        this.rotateRight(p);
        node = node.right;
    }
    
    g = this.getGrandparent(node);
    p = node.parent;
    
    p.color.setBlack();
    g.color.setRed();
    node === p.left
        ? this.rotateRight(g)
        : this.rotateLeft(g);
    
    return true;
};


Set489.prototype.remove = function(val)
{
    var nodeToDelete = this.getNode(val);
    if (nodeToDelete === null) return false;
    
    var removed = this.retrieveAndRemove(nodeToDelete);
    if (removed !== null)
    {
        this.removeFromLinkedList(removed);
        
        this.m_count--;
        return true;
    }
    
    return false;
};

Set489.prototype.retrieveAndRemove = function(node)
{
    var res = false;
    
    if (node === null)
    {
        return null;
    }
    
    if (node.left !== null && node.right !== null)
    {
        var max = this.getMaxNode(node.left);
        var replacement =  this.retrieveAndRemove(max);
        if (replacement !== null)
        {
            /* Replace the max value node with the node that is being removed */
            replacement.left = node.left;
            replacement.right = node.right;
            replacement.parent = node.parent;
            if (node.parent !== null)
            {
                if (node.parent.left === node)
                {
                    node.parent.left = replacement;
                }
                else
                {
                    node.parent.right = replacement;
                }
            }
            if (node.left !== null)
            {
                replacement.left.parent = replacement;
            }
            if (node.right !== null)
            {
                replacement.right.parent = replacement;
            }

            /* Update the root if necessary */
            if (node === this.m_root)
            {
                this.m_root = replacement;
            }
        }

        node.left = node.right = node.parent = null;
        return node;
    }
    
    if (node.color.isRed())
    {
        return BST.prototype.retrieveAndRemove.call(this, node.value, node);
    }
    
    this.prepareForRemoval(node);
    return BST.prototype.retrieveAndRemove.call(this, node.value, node);
};

Set489.prototype.prepareForRemoval = function(node)
{
    if (node.parent === null) return; /* This was the root node */
    
    var p = node.parent;
    var g = this.getGrandparent(node);
    var s = this.getSibling(node);
    
    /* S is RED, so P must be BLACK */
    if (s.color.isRed())
    {
        p.color.setRed();
        s.color.setBlack();
        if (node == p.left) this.rotateLeft(p);
        else this.rotateRight(p);
    }
    
    s = this.getSibling(node);
    
    /* P, S, and S's children are all BLACK */
    if (p.color.isBlack() && 
        s.color.isBlack() &&
        (s.left === null || s.left.color.isBlack()) &&
        (s.right === null || s.right.color.isBlack()))
    {
        s.color.setRed();
        this.prepareForRemoval(p);
        return;
    }

    /* P is RED, S and S's children are all BLACK */
    if (p.color.isRed() && 
        s.color.isBlack() &&
        (s.left === null || s.left.color.isBlack()) &&
        (s.right === null || s.right.color.isBlack()))
    {
        s.color.setRed();
        p.color.setBlack();
        return;
    }
    
    if (node === p.left &&
        (s.left !== null && s.left.color.isRed()) &&
        (s.right === null || s.right.color.isBlack()))
    {
        s.color.setRed();
        s.left.color.setRed();
        this.rotateRight(s);
    }
    else if (node === p.right &&
             (s.left === null || s.left.color.isBlack()) &&
             (s.right !== null && s.right.color.isRed()))
    {
        s.color.setRed();
        s.right.color.setBlack();
        this.rotateLeft(s);
    }
    
    s = this.getSibling(node);
    
    s.color = p.color;
    p.color.setBlack();
    
    if (node === p.left)
    {
        s.right.color.setBlack();
        this.rotateLeft(p);
    }
    else
    {
        s.left.color.setBlack();
        this.rotateRight(p);
    }
};


Set489.prototype.rotateLeft = function(node)
{
    if (node === null || node === undefined)
    {
        return;
    }
    
    /* We are rotating the node's right child into its location */
    var child = node.right;
    
    /* Grab the child's left subtree and place it where the child was */
    node.right = child.left;
    if (child.left !== null)
    {
        child.left.parent = node;
    }
    
    /* Update the child's parent node to the be parent of the node being swapped out */
    child.parent = node.parent;
    
    if (node.parent === null) /* node was the root! */
    {
        this.m_root = child;
    }
    else
    {
        /* Update the parent's node reference to the child node */
        if (node === node.parent.right) 
        {
            node.parent.right = child;
        }
        else
        {
            node.parent.left = child;
        }
    }
    
    /* Modify the references to between the two nodes themselves */
    child.left = node;
    node.parent = child;
};

Set489.prototype.rotateRight = function(node)
{
    if (node === null || node === undefined)
    {
        return;
    }
    
    /* We are rotating the node's left child into its location */
    var child = node.left;
    
    /* Grab the child's right subtree and place it where the child was */
    node.left = child.right;
    if (child.right !== null)
    {
        child.right.parent = node;
    }
    
    /* Update the child's parent node to the be parent of the node being swapped out */
    child.parent = node.parent;
    
    if (node.parent === null) /* node was the root! */
    {
        this.m_root = child;
    }
    else
    {
        /* Update the parent's node reference to the child node */
        if (node === node.parent.right) 
        {
            node.parent.right = child;
        }
        else
        {
            node.parent.left = child;
        }
    }
    
    /* Modify the references to between the two nodes themselves */
    child.right = node;
    node.parent = child;
};

/*** End Set489 ***/


/*
*
*
*
*/

/*** Function object declaration for object Color ***/
function Color()
{
    this.node_color = 1; /* Red = 1, Black = 0 */
    this.color = "Red";
};

Color.prototype.isRed = function()
{
    return this.node_color === 1;
};

Color.prototype.isBlack = function()
{
    return this.node_color === 0;
};

Color.prototype.setBlack = function()
{
    this.node_color = 0;
    this.color = "Black"
};

Color.prototype.setRed = function()
{
    this.node_color = 1;
    this.color = "Red"
};
/*** End Color ***/