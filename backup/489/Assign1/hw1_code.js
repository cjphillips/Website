// Student name: Colin Phillips
// Student ID: 11357836

// Do not modify this constructor function. Even if you are going for that 3rd
// "challenge point", you will only need to modify "add" and "remove".
function SortedLL489(optionalCompare)
{
    this.m_root = null;
    if (optionalCompare === undefined || optionalCompare == null)
    {
        this.m_compare = function(a,b)
        {
            if (a > b) { return 1; }
            return (a == b) ? 0 : -1;
        };
    }
    else
    {
        this.m_compare = optionalCompare;
    }
    Object.seal(this);
}

SortedLL489.prototype.add = function(valueToAdd)
{
    if (valueToAdd === undefined || valueToAdd === null)
    {
        // Do not attempt to add a null or undefined value
        return;
    }
    
    var newNode = {
        value: valueToAdd,
        next: null,
        previous: null
    }
    
    if (this.m_root === undefined || this.m_root == null)
    {
        // The list is currently empty
        this.m_root = newNode;
    }
    else if (this.m_compare(newNode.value, this.m_root.value) < 0)
    {
        // The list is not empty and we are inserting at the front of the list
        newNode.next = this.m_root;
        this.m_root.previous = newNode;
        this.m_root = newNode;
    }
    else
    {
        // The list is not empty and we are inserting either in the middle or at the end
        var curNode = this.m_root.next, prevNode = this.m_root;
        
        while(curNode !== undefined && curNode !== null)
        {
            if (this.m_compare(newNode.value, curNode.value) < 0)
            {
                prevNode.next = newNode;
                newNode.previous = prevNode;
                newNode.next = curNode;
                curNode.previous = newNode;
                break;
            }
            
            prevNode = curNode;
            curNode = curNode.next;
        }
        
        if (curNode === undefined || curNode === null)
        {
            // Inserting at the end of the list
            prevNode.next = newNode;
            newNode.previous = prevNode;
        }
    }
}

// Implement this function so that it removes the specified value from the list
// If the value is not in the list, then the list is not modified
SortedLL489.prototype.remove = function(valueToRemove)
{
    if (valueToRemove === undefined || valueToRemove == null)
    {
        // Do not attempt to remove an undefined or null value
        return;
    }
    
    if (this.m_root === undefined || this.m_root == null)
    {
        // Cannot operate on an empty list!
        return;
    }
    
    if (this.m_compare(this.m_root.value, valueToRemove) === 0 && 
        (this.m_root.next === null || this.m_root.next === undefined))
    {
        this.m_root = null;
    }
    
    var curNode = this.m_root;
    while(curNode !== undefined && curNode !== null)
    {
        if (this.m_compare(curNode.value, valueToRemove) === 0)
        {
            if (curNode.previous === undefined || curNode.previous === null)
            {
                // Removing the head of the list
                this.m_root = this.m_root.next;
                this.m_root.previous = null;
            }
            else
            {
                curNode.previous.next = curNode.next;
                if (curNode.next !== undefined && curNode.next !== null)
                {
                    curNode.next.previous = curNode.previous;
                }
                
                curNode.next = curNode.previous = null;
            }
            
            break;
        }
        
        curNode = curNode.next;
    }
}

// This function is implemented for you
// You must not alter it in any way
SortedLL489.prototype.toString = function()
{
    var node = this.m_root;
    var str = "";
    while (node !== undefined && node !== null)
    {
        // Append to string
        str += node.value.toString();
        
        // Check the 'next' member
        if (node.next === undefined)
        {
            str += "(node missing 'next' member)";
            return str;
        }
        else if (node.next !== null)
        {
            str += ",";
        }
        
        // Advance to the next node
        node = node.next;
    }
    return str;
}

