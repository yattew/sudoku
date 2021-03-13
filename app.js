//####################################################################################
//####################################################################################
//####################################################################################
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function fill_3x3(r, c, board) {
    var d = new Date()
    let pre = Math.floor(Math.random() * d.getSeconds());
    for (let i = 0; i < pre; i++) { 
        Math.random();
    }
    for (let i = r; i < r + 3; i++)
        for (let j = c; j < r + 3; j++) {
            if (board[i][j] == 0) {
                let rand = Math.ceil(Math.random() * 9);
                while (!valid(board, rand, [i, j])[0]) {
                    rand = Math.ceil(Math.random() * 9);
                }
                board[r][c] = rand;
            }
        }
}

function clear_board(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = 0;
        }
    }
}

function create_board() {
    let board = [];
    for (let i = 0; i < 9; i++) {
        let temp = [];
        for (let j = 0; j < 9; j++) {
            temp.push(0);
        }
        board.push(temp);
    }

    fill_3x3(0, 0, board);
    fill_3x3(3, 3, board);
    fill_3x3(6, 6, board);
    solve(board);
    for (let i = 0; i < 75; i++) {
        let pos = [Math.floor(Math.random() * 9), Math.floor(Math.random() * 9)];
        board[pos[0]][pos[1]] = 0;
    }
    return board;
}


function set_board(board,readonly = true) {
    const board_html = document.querySelector('.board');
    const rows = board_html.children;
    for (let i = 0; i < 9; i++) {
        const cols = rows[i].children;
        for (let j = 0; j < 9; j++) {
            if (board[i][j]) {
                cols[j].value = board[i][j];
                if(readonly){
                    cols[j].readOnly = true;
                    cols[j].r = true;
                }
                cols[j].style.color = "black";
            }
            else {
                cols[j].value = '';
                cols[j].readOnly = false;
                cols[j].r = false;
                cols[j].style.color = "blue";
            }

        }
    }
}

function valid(board, num, pos) {
    let flag = true;
    let error_pos_arr = []
    for (let i = 0; i < 9; i++) {
        if (board[pos[0]][i] == num && pos[1] != i) {
            flag = false;
            error_pos_arr.push([pos[0], i]);
        }
    }

    for (let i = 0; i < 9; i++) {
        if (board[i][pos[1]] == num && pos[0] != i) {
            flag = false;
            error_pos_arr.push([i, pos[1]]);
        }

    }
    let mat_x = Math.floor(pos[1] / 3);
    let mat_y = Math.floor(pos[0] / 3);
    for (let i = mat_y * 3; i < mat_y * 3 + 3; i++) {
        for (let j = mat_x * 3; j < mat_x * 3 + 3; j++) {
            if (board[i][j] == num && pos[0] != i && pos[1] != j) {
                flag = false;
                error_pos_arr.push([i, j]);
            }
        }
    }
    return [flag, error_pos_arr];
}

function find_empty(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return 0;
}

function solve(board) {
    find = find_empty(board);
    if (find == 0) {
        return true;
    }
    else {
        var [r, c] = find;
    }
    for (let i = 1; i <= 9; i++) {
        if (valid(board, i, [r, c])[0]) {
            board[r][c] = i;
            if (solve(board)) {
                return true;
            }
            board[r][c] = 0;
        }
    }
    return false;
}

function check_board(board) {
    let error_arr = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!valid(board, board[i][j], [i, j])[0]) {
                error_arr.push([i, j]);
            }
        }
    }
    return error_arr;
}
function copy_board(board){
    let b = []
    for(let i = 0; i<9; i++){
        let temp = [];
        for(let j = 0; j<9; j++){
            temp.push(board[i][j]);
        }
        b.push(temp);
    }
    return b;
}
//####################################################################################
//####################################################################################
//####################################################################################
const inp = document.querySelectorAll('input');
const solve_btn = document.querySelector('#solve');
const generate_button = document.querySelector('#generate');
const check_button = document.querySelector('#check');

let board = create_board();


set_board(board);
let board_backup = copy_board(board);



solve_btn.addEventListener('click', () => {
    board = board_backup;
    solve(board);
    for(let i = 0; i<inp.length; i++){
        inp[i].style.backgroundColor = 'white';
    }
    set_board(board);
});



generate_button.addEventListener('click', () => {
    clear_board(board);
    for(let i = 0; i<inp.length; i++){
        inp[i].style.backgroundColor = 'white';
    }
    board = create_board();
    board_backup = copy_board(board);
    set_board(board);
});



let pos = [0, 0];

for (let i = 0; i < inp.length; i++) {
    inp[i].addEventListener('focus',()=>{
        setTimeout(()=>{
            inp[i].selectionStart = inp[i].selectionEnd = 10000;
        },0)
    });
    inp[i].addEventListener('click',()=>{
        setTimeout(()=>{
            inp[i].selectionStart = inp[i].selectionEnd = 10000;
        },0)
        for(let j = 0; j<inp.length; j++){
            inp[j].style.backgroundColor = 'white';
        }
    });
    inp[i].addEventListener('input', function () {
        let p = [Math.floor(i / 9), i % 9];
        let is_valid = valid(board, board[p[0]][p[1]], p);

        if (inp[i].value.length > 1) {
            inp[i].value = inp[i].value.substr(1, 2);
        }

        if (!isNumeric(inp[i].value)) {
            inp[i].value = '';

            for (let j = 0; j < is_valid[1].length; j++) {
                let inp_p = is_valid[1][j][0] * 9 + is_valid[1][j][1];
                inp[inp_p].style.backgroundColor = 'white';
            }

            board[p[0]][p[1]] = 0;
        }

        else {
            if (inp[i].value === '0') {
                board[p[0]][p[1]] = 0;
                inp[i].value = '';
                return;
            }
            for (let j = 0; j < is_valid[1].length; j++) {
                let inp_p = is_valid[1][j][0] * 9 + is_valid[1][j][1];
                inp[inp_p].style.backgroundColor = 'white';
            }
            board[p[0]][p[1]] = parseInt(inp[i].value);
            is_valid = valid(board, board[p[0]][p[1]], p);
            if (!is_valid[0]) {
                for (let j = 0; j < is_valid[1].length; j++) {
                    let inp_p = is_valid[1][j][0] * 9 + is_valid[1][j][1];
                    inp[inp_p].style.backgroundColor = '#fc6060';
                }
            }
        }
    });
}



check_button.addEventListener('click', function () {
    for(let i = 0; i<inp.length; i++){
        inp[i].style.backgroundColor = 'white';
    }
    let errors = check_board(board);
    for(let i = 0; i<errors.length; i++){
        let inp_p = errors[i][0]*9+errors[i][1];
        inp[inp_p].style.backgroundColor = '#fc6060';
    }
});


for(let i = 0; i<inp.length; i++){
    let p = [Math.floor(i / 9), i % 9];
    if(p[1]==0){
        inp[i].style.borderLeftWidth = "3px";
        inp[i].style.borderLeftColor = "black";
    }
    if(p[0] == 0){
        inp[i].style.borderTopWidth = "3px";
        inp[i].style.borderTopColor = "black";
    }
    if((p[0]+1)%3 == 0){
        inp[i].style.borderBottomWidth = "3px";
        inp[i].style.borderBottomColor = "black";
    }
    if((p[1]+1)%3==0){
        inp[i].style.borderRightWidth = "3px";
        inp[i].style.borderRightColor = "black";
    }
}




