import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");

const range = (n) => Array.from({"length": n}, (ignore, k) => k); // question - what does this line mean can you explain it

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const next_mini_grid = document.getElementById("next_tertromino_grid");

const next_minicells = range(6).map(function () {
    const minirow = document.createElement("div");
    minirow.className = "minirow";

    const minirows = range(6).map(function () {
        const minicell = document.createElement("div");
        minicell.className = "minicell";

        minirow.append(minicell);

        return minicell;
    });

    next_mini_grid.append(minirow);
    return minirows;
});

const held_mini_grid = document.getElementById("held_tertromino_grid");

const held_minicells = range(6).map(function () {
    const minirow = document.createElement("div");
    minirow.className = "minirow";

    const minirows = range(6).map(function () {
        const minicell = document.createElement("div");
        minicell.className = "minicell";

        minirow.append(minicell);

        return minicell;
    });

    held_mini_grid.append(minirow);
    return minirows;
});

const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    next_minicells.flat().forEach(function (minicell) {
        minicell.className = `minicell`;
    });

    Tetris.tetromino_coordiates(game.next_tetromino, [1,1]).forEach(
        function (coord) {
            try {
                const cell = next_minicells[coord[1]][coord[0]];
                cell.className = (
                    `minicell ${game.next_tetromino.block_type}`
                );
            } catch (ignore) {
            }
        }
    );

    held_minicells.flat().forEach(function (minicell) {
        minicell.className = `minicell`;
    });

    if (game.held_tetromino) {
        Tetris.tetromino_coordiates(game.held_tetromino, [1,1]).forEach(
            function (coord) {
                try {
                    const cell = held_minicells[coord[1]][coord[0]];
                    cell.className = (
                        `minicell ${game.held_tetromino.block_type}`
                    );
                } catch (ignore) {
                }
            }
        );
    }
};



// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
