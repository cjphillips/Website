// Student name: Colin Phillips
// Student ID: 11357836

/**** Sudoku9x9 ****/

function Sudoku9x9(arrOf81Values)
{
    this.cells = new Array();
    
    for (var i = 0; i < 81; i++)
    {
        var newCell = new SudokuCell(9);
        var value = arrOf81Values[i];
        if (value instanceof Number || typeof value === "number")
        {
            if (value > 0 && value < 10)
            {
                newCell.finalizedValue = value;
            }
        }
        else
        {
            for(var j = 1; j <= 9; j++)
            {
                if (!value.containsPossibility(j)) { newCell.removePossibility(j); }
            }
        }
        this.cells.push(newCell);
    }
    /*
    // See if we can narrow down the results already
    for(var i = 0; i < 81; i++)
    {
        var cell = this.cells[i];
        var info = this.getCellPosInfo(i);
        var onRow = this.getRow(info.rowIndex, true);
        var onCol = this.getColumn(info.colIndex, true);
        var onBox = this.get3x3(info.box3x3StartRow, info.box3x3StartCol, true).collection;
        
        for(var num = 1; num <= 9; num++)
        {
            if (onRow.indexOf(num) >= 0 ||
                onCol.indexOf(num) >= 0 ||
                onBox.indexOf(num) >= 0)
            {
                cell.removePossibility(num);
            }
        }
    }*/
};

Sudoku9x9.prototype.solve = function(index)
{
    if (index === undefined) index = 0;
    
    /* Find an unfinalized cell */
    while(index < this.cells.length)
    {
        if (!this.cells[index].isFinalized) break;
        index++;
    }

    if (index == this.cells.length) return { solved: true };
    
    var cell = this.cells[index];
    var info = this.getCellPosInfo(index); // Map the index to a 2D grid (row, column)
    var possibilities = cell.getPossibilities();

    /* Try all possibilities */
    for(var i = 0; i < possibilities.length ; i++)
    {
        var num = possibilities[i];
        
        /* If this number is not used anywhere in its row, cell, or 3x3 box then finalize
           with this number */
        if (!this.isInRow(num, info.rowIndex) &&
            !this.isInColumn(num, info.colIndex) &&
            !this.isIn3x3(num, info.box3x3StartRow, info.box3x3StartCol))
        {
            cell.finalizedValue = num;
            
            /* Recursively call solve for each index */
            if (this.solve(index).solved) return { solved: true };
            
            /* This is not the right number ... try another */
            cell.possibleValues = possibilities;
        }
    }
    
    return { solved: false };
}

Sudoku9x9.prototype.getCellPosInfo = function (index)
{
    var row = Math.floor(index / 9);
    var col = index % 9;

    var boxRow, boxCol;
    if (row < 3) boxRow = 0;
    else if (row < 6) boxRow = 1;
    else boxRow = 2;

    if (col < 3) boxCol = 0;
    else if (col < 6) boxCol = 1;
    else boxCol = 2;

    return {
        rowIndex: row, 
        colIndex: col,
        box3x3StartRow: boxRow,
        box3x3StartCol: boxCol
    };
};

Sudoku9x9.prototype.isInRow = function (value, row)
{
    for(var col = 0; col < 9; col++)
    {
        var cell = this.cells[col + 9 * row];
        if (cell.isFinalized && cell.finalizedValue == value) return true;
    }
    
    return false;
};

Sudoku9x9.prototype.isInColumn = function(value, col)
{
    for(var row = 0; row < 9; row++)
    {
        var cell = this.cells[row * 9 + col];
        if (cell.isFinalized && cell.finalizedValue == value) return true;
    }
    
    return false;
};

Sudoku9x9.prototype.isIn3x3 = function(value, rowIndex, colIndex)
{
    var row = rowIndex * 3; // 0
    var col = colIndex * 3;
    
    for(var counter = 0; counter < 9; counter++)
    {
        if (counter !== 0 && counter % 3 == 0) { col = colIndex * 3; row++; }
        
        var cell = this.cells[(row * 9) + col];
        if (cell.isFinalized && cell.finalizedValue == value) return true;
        col++;
    }
    
    return false;
};

Sudoku9x9.prototype.get3x3 = function(rowIndex, colIndex, onlyFinalized)
{
    if (onlyFinalized === undefined) onlyFinalized = false;
    
    var row = rowIndex * 3; // 0
    var col = colIndex * 3;
    var arr = new Array();
    
    for(var counter = 0; counter < 9; counter++)
    {
        if (counter !== 0 && counter % 3 == 0) { col = colIndex * 3; row++; }
        
        var value = this.cells[(row * 9) + col];
        if (onlyFinalized && value.isFinalized) arr.push(value);
        col++;
    }
    
    return new Sudoku3x3Block(arr);
};

Sudoku9x9.prototype.getColumn = function(colIndex, onlyFinalized)
{
    if (onlyFinalized === undefined) onlyFinalized = false;
    
    var arr = new Array();
    
    for(var row = 0; row < 9; row++)
    {
        var value = this.cells[row * 9 + colIndex];
        if (onlyFinalized && value.isFinalized) arr.push(value);
    }
    
    return arr;
};

Sudoku9x9.prototype.getRow = function(rowIndex, onlyFinalized)
{
    if (onlyFinalized === undefined) onlyFinalized = false;
    
    var arr = new Array();
    
    for(var col = 0; col < 9; col++)
    {
        var value = this.cells[col + 9 * rowIndex];
        if (onlyFinalized && value.isFinalized) arr.push(value);
    }
    
    return arr;
};

Sudoku9x9.prototype.toArray = function()
{
    var collection = new Array();
    
    for(var i = 0; i < this.cells.length; i++)
    {
        var from = this.cells[i];
        var to = new SudokuCell(9);
        
        if (from.isFinalized)
        {
            to.finalizedValue = from.finalizedValue;
        }
        else
        {
            for(var j = 1; j <= 9; j++)
            {
                if (!from.containsPossibility(j))
                {
                    to.removePossibility(j);
                }
            }
        }
        
        collection.push(to);
    }
    
    return collection;
};


/**** END Sudoku9x9 ****/
/*
*
*
*/
/**** SudokuCell ****/

function SudokuCell(numPossibleValues)
{
    var finalValue = undefined;
    
    /*Object.defineProperty(this, 
                          "possibleValues", 
                          {writeable: true,
                           enumerable: false,
                           value: new Array()});*/
    this.possibleValues = new Array();
    
    Object.defineProperty(this,
                          "isFinalized",
                          {enumerable: true,
                           get: function() { return this.possibleValues.length === 1; }});
    
    Object.defineProperty(this,
                          "finalizedValue",
                          {enumerable: true,
                           get: function() { return finalValue; },
                           set: function(value) 
                            { 
                                this.possibleValues = new Array(); 
                                this.possibleValues.push(value);
                                finalValue = value;
                            }
                          });
    
    // Initialize the possible values array
    for(var value = 1; value <= numPossibleValues; value++)
    {
        this.possibleValues.push(value);
    }
};

SudokuCell.prototype.containsPossibility = function(value)
{
    if (value === null || value === undefined) return false;
    
    for(var i = 0; i < this.possibleValues.length; i++)
    {
        if (this.possibleValues[i] === value) return true;
    }
    
    return false;
};

SudokuCell.prototype.getPossibilities = function()
{
    var arr = new Array();
    for(var i = 0; i < this.possibleValues.length; i++)
    {
        arr.push(this.possibleValues[i]);
    }
    
    arr.sort();
    return arr;
};

SudokuCell.prototype.removePossibility = function(value)
{
    if (value === null || value === undefined) return false;
    if (this.isFinalized) return false;
    
    var valueIndex = this.possibleValues.indexOf(value);
    if (valueIndex >= 0)
    {
        this.possibleValues.splice(valueIndex, 1);
        if (this.possibleValues.length === 1) 
        {
            this.finalizedValue = this.possibleValues[0];
        }
        return true;
    }
    
    return false;
};

SudokuCell.prototype.removePossibilities = function(arrOfValues)
{
    if (arrOfValues === null || arrOfValues === undefined) return;
    
    var totalRemoved = 0;
    
    for(var i = 0; i < arrOfValues.length; i++)
    {
        if (this.removePossibility(arrOfValues[i])) totalRemoved++;
    }
    
    return totalRemoved;
};

SudokuCell.prototype.equals = function(cell)
{
    if (!(cell instanceof SudokuCell)) return false;
    
    var thatContent = cell.getPossibilities();
    var thisContent = this.possibleValues.sort();
    
    if (thatContent.length !== thisContent.length) return false;
    
    for(var i = 0; i < thisContent.length; i++)
    {
        if (thatContent[i] !== thisContent[i]) return false;
    }
    
    return true;
}

SudokuCell.prototype.toString = function()
{
    var str = "";
    var arr = this.getPossibilities();
    for(var i = 0; i < arr.length; i++)
    {
        str += arr[i];
        if (i < arr.length - 1) str += " "
    }
    
    return str;
};

/**** END SudokuCell ****/
/*
*
*
*/
/**** SudokuCellCollection ****/

function SudokuCellCollection(arrOfCells)
{
    this.collection = new Array();
    
    Object.defineProperty(this,
                          "length",
                          {enumerable: true,
                           get: function() { return this.collection.length; }});
    
    for(var i = 0; i < arrOfCells.length; i++)
    {
        var cell = arrOfCells[i];
        var newCell = new SudokuCell(9);
        if (cell.isFinalized)
        {
            newCell.finalizedValue = cell.finalizedValue;
        }
        else
        {
            for(var j = 1; j <= 9; j++)
            {
                if (!cell.containsPossibility(j)) { newCell.removePossibility(j); }
            }
        }
        
        this.collection.push(newCell);
    }
};

SudokuCellCollection.prototype.containsCell = function(cell)
{
    for(var i = 0; i < this.collection.length; i++)
    {
        if (this.collection[i] === cell) return true;
    }
    
    return false;
};

SudokuCellCollection.prototype.containsPossibility = function(value)
{
    for(var i = 0; i < this.collection.length; i++)
    {
        if (this.collection[i].containsPossibility(value)) return true;
    }
    
    return false;
};

SudokuCellCollection.prototype.count = function(predicate)
{
    var total = 0;
    
    for(var i = 0; i < this.collection.length; i++)
    {
        if (predicate(this.collection[i])) total++;
    }
    
    return total;
};

SudokuCellCollection.prototype.forEach = function(functionThatTakes1CellParam, startIndex)
{
    if (startIndex === undefined) startIndex = 0;
    
    for(var i = startIndex; i < this.collection.length; i++)
    {
        functionThatTakes1CellParam(this.collection[i]);
    }
};

SudokuCellCollection.prototype.getFinalizedValues = function()
{
    var arr = new Array();
    
    for(var i = 0; i < this.collection.length; i++)
    {
        if (this.collection[i].isFinalized) arr.push(this.collection[i].finalizedValue);
    }
    
    return arr;
};

SudokuCellCollection.prototype.getPossibilities = function()
{
    var arr = new Array();
    
    for(var i = 0; i < this.collection.length; i++)
    {
        if (!this.collection[i].isFinalized)
        {
            var possibilities = this.collection[i].getPossibilities();
        
            for(var j = 0; j < possibilities.length; j++)
            {
                var val = possibilities[j];
                if (arr.indexOf(val) < 0) arr.push(val);
            }   
        }
    }
    arr.sort();
    return arr;
};

SudokuCellCollection.prototype.removeCell = function(cell)
{
    var arr = new Array();
    
    for(var i = 0; i < this.collection.length; i++)
    {
        if (!this.collection[i].equals(cell)) arr.push(this.collection[i]);
    }
    
    return new SudokuCellCollection(arr);
};

SudokuCellCollection.prototype.removeCells = function(otherCellCollection)
{
    if (!(otherCellCollection instanceof SudokuCellCollection)) return this;
    
    var arr = new Array();
    
    for(var i = 0; i < this.collection.length; i++)
    {
        if (!otherCellCollection.containsCell(this.collection[i]))
        {
            arr.push(this.collection[i]);
        }
    }
    
    return new SudokuCellCollection(arr);
};

SudokuCellCollection.prototype.removePossibility = function(value)
{
    var total = 0;
    
    for (var i = 0; i < this.cells.length; i++)
    {
        if (this.cells[i].removePossibility(value)) total++;
    }
    
    return total;
};

/**** END SudokuCellCollection ****/
/*
*
*
*/
/**** SudokuCellBlock ****/

function SudokuCellBlock(arrOf9Values)
{
    SudokuCellCollection.call(this, arrOf9Values);
};

// Inherit prototype from SudokuCellCollection:
SudokuCellBlock.prototype = Object.create(SudokuCellCollection.prototype);

SudokuCellBlock.prototype.trySolve = function()
{
    var _solved = false, _changed = false;
    
    var finalizedValues = new Array();
    var missingValues = new Array();
    var nonFinalizedCells = new Array();
    
    // Look at all of the cells in the collection
    for(var i = 0; i < this.collection.length; i++)
    {
        var cell = this.collection[i];
        if (cell.isFinalized)
        {
            // The cell was finalized; retain its value
            finalizedValues.push(cell.finalizedValue);
        }
        else
        {
            // The cell is undetermined; we'll come back to it later
            nonFinalizedCells.push(cell);
        }
    }
    
    // Get the values that have not been assigned (finalized) to any cell
    for(var value = 1; value <= this.collection.length; value++)
    {
        if (finalizedValues.indexOf(value) < 0)
        {
            missingValues.push(value);
        }
    }
    
    var checked = new Array();
    // Look through all non-finalized cells and attempt to determine their final value
    for(var i = 0; i < nonFinalizedCells.length; i++)
    {
        var cell = nonFinalizedCells[i];
        if (cell.removePossibilities(finalizedValues) > 0) _changed = true;
        
        if (cell.isFinalized)
        {
            finalizedValues.push(cell.finalizedValue);
        }
        else
        {
            var cellsPoss = cell.getPossibilities();
            for(var j = 0; j < cellsPoss.length; j++)
            {
                var found = false;
                for(var k = 0; k < checked.length; k++)
                {
                    var cont = checked[k];
                    if (cont.value === cellsPoss[j]) 
                    {
                        cont.refCells.push(cell);
                        found = true;
                    }
                }

                if (!found)
                {
                    checked.push({
                        value: cellsPoss[j],
                        refCells: [cell]
                    });
                }
            }
        }
    }
    
    for(var i = 0; i < checked.length; i++)
    {
        var cont = checked[i];
        if (cont.refCells.length === 1)
        {
            var cell = cont.refCells[0];
            cell.finalizedValue = cont.value;
            finalizedValues.push(cont.value);
        }
    }
    
    if (finalizedValues.length === this.collection.length) _solved = true;
    
    return { changed: _changed, solved: _solved };
};

/**** END SudokuCellBlock ****/
/*
*
*
*/
/**** Sudoku3x3Block ****/

function Sudoku3x3Block(arrOf9Values)
{
    SudokuCellBlock.call(this, arrOf9Values);
};

//  Inherit prototype from SudokuCellBlock:
Sudoku3x3Block.prototype = Object.create(SudokuCellBlock.prototype);

Sudoku3x3Block.prototype.getPossibilitiesOnlyAvailableOnColumn = function(colIndex)
{
    var colPossibilities = new Array();
    for(var row = 0; row < 3; row++)
    {
        var cell = this.collection[row * 3 + colIndex];
        for(var index = 0; index < cell.possibleValues.length; index++)
        {
            var value = cell.possibleValues[index];
            if (colPossibilities.indexOf(value) < 0)
            {
                colPossibilities.push(value);
            }
        }
    }
    
    colPossibilities.sort();
    return colPossibilities;
};

Sudoku3x3Block.prototype.getPossibilitiesOnlyAvailableOnRow = function(rowIndex)
{
    var rowPossibilities = new Array();
    for(var col = 0; col < 3; col++)
    {
        var cell = this.collection[col + 3 * rowIndex];
        for(var index = 0; index < cell.possibleValues.length; index++)
        {
            var value = cell.possibleValues[index];
            if (rowPossibilities.indexOf(value) < 0)
            {
                rowPossibilities.push(value);
            }
        }
    }
    
    rowPossibilities.sort();
    return rowPossibilities;
};

Sudoku3x3Block.prototype.isColumnFinalized = function(colIndex)
{
    for(var row = 0; row < 3; row++)
    {
        var cell = this.collection[row * 3 + colIndex];
        if (!cell.isFinalized) return false;
    }
    
    return true;
};

Sudoku3x3Block.prototype.isRowFinalized = function(rowIndex)
{
    for(var col = 0; col < 3; col++)
    {
        var cell = this.collection[col + 3 * rowIndex];
        if (!cell.isFinalized) return false;
    }
    
    return true;
};

Sudoku3x3Block.prototype.toString = function()
{
    // TODO
};

/**** END SudokuCellBlock ****/