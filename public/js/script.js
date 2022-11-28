class App {
    constructor() {
        this.mouseObj = {
            mouseDown: false,
        }
        this.board = [];
        this.flagBoard = [];
        this.mineNum = [];
        this.setting();
        this.setEvent();
        this.currentTarget = null;
    }
    setEvent() {
        $(document)
            .on('mousedown', '.game_board div', (e) => {
                if ((e.button == 2) || (e.which == 3)) {
                    if (!$(e.currentTarget).hasClass('open')) {
                        this.flag(e.currentTarget);
                    }
                } else {
                    this.mouseObj.mouseDown = true;
                    this.currentTarget = e.currentTarget;
                    if ($(e.currentTarget).hasClass('unopen')) {
                        $(e.currentTarget).addClass('press');
                    } else {
                        let line = parseInt($(this.currentTarget).attr('line-id'));
                        let num = parseInt($(this.currentTarget).attr('num-id'));
                        this.open(true);
                    }
                }
            })
            .on('mouseup', '.game_board div', (e) => {
                if ((e.button == 2) || (e.which == 3)) {
                } else {
                    this.mouseObj.mouseDown = false;
                    $(this.currentTarget).removeClass('unopen');
                    if ($(this.currentTarget).hasClass('open')) {
                        this.open(true);
                    } else {
                        this.open();
                    }
                }
            })
            .on('mousemove', '.game_board div', (e) => {
                if (this.mouseObj.mouseDown) {
                    $('.press').removeClass('press');
                    this.currentTarget = e.currentTarget;
                    $(e.currentTarget).addClass('press');
                }
            })
            .on('mouseleave', '.game_board', (e) => {
                this.mouseObj.mouseDown = false;
                this.currentTarget = null;
            });
    }
    flag(target) {
        let line = parseInt($(target).attr('line-id')) - 1;
        let num = parseInt($(target).attr('num-id')) - 1;
        $(target).removeClass('unopen');
        if ($(target).hasClass('flag')) {
            $(target).removeClass('flag');
            $(target).addClass('unopen');
            this.flagBoard[line][num] = 0;
        } else {
            $(target).addClass('flag');
            this.flagBoard[line][num] = 'flag';
        }
    }
    gameOver() {
        for (let i = 1; i <= 16; i++) {
            for (let j = 1; j <= 16; j++) {
                if (this.board[i][j] === 'mine') {
                    this.setImage(i + 1, j + 1);
                }
            }
        }
    }
    open(expand = false) {
        if (this.currentTarget === null) return;
        $(this.currentTarget).removeClass('unopen');
        let line = parseInt($(this.currentTarget).attr('line-id'));
        let num = parseInt($(this.currentTarget).attr('num-id'));
        console.log(line, num);
        this.setImage(line, num);
        let target = this.board[line - 1][num - 1];
        let flag = this.flagBoard[line - 1][num - 1];
        $(this.currentTarget).addClass('open');
        if (target === 'mine') return this.gameOver();
        if (target === 'flag') return;

        if (Boolean(expand) || target === 0) {
            let flagChk = this.checkAround(line, num, false, true);
            let around = this.checkAround(line, num);
            if (target === 0) {
                around.forEach(ele => {
                    this.setImage(ele.line + 1, ele.num + 1);
                    if (this.board[ele.line][ele.num] === 0) {
                        let d = this.checkAround(line, num,false,false);
                        d.forEach(ele => {
                            console.log(ele);
                            this.setImage(ele.line + 1, ele.num + 1 );
                        })
                    }
                })
            }
            if (target === flagChk) {
                if (target !== 0) {
                    around.forEach(ele => {
                        if (this.board[ele.line][ele.line] === 'mine') {
                            this.gameOver();
                        } else if (this.flagBoard[ele.line][ele.num] === 'flag') return
                        this.setImage(ele.line + 1, ele.num + 1);
                    })
                }

            } else {
                if (this.mouseObj.mouseDown) {
                    around.forEach(ele => {
                        this.setImage(ele.line + 1, ele.num + 1, true);
                    })
                } else {
                    around.forEach(ele => {
                        this.setImage(ele.line + 1, ele.num + 1, false, true);
                    })
                }
            }
        }
    }
    setImage(line, num, press = false, pc = false) {
        let target = $(`.game_board div[line-id="${line}"][num-id="${num}"]`);
        let number = this.board[line - 1][num - 1];
        if (pc) {
            target.removeClass('press');
            return;
        }
        if (press) {
            target.addClass('press');
            return
        }
        if (number === 'mine') {
            target.addClass('redMine')
        }

        if (number === 0) {
            target.addClass('opened')
        }
        if (number === 1) {
            target.addClass('type1')
        }

        if (number === 2) {
            target.addClass('type2')
        }

        if (number === 3) {
            target.addClass('type3')
        }

        if (number === 4) {
            target.addClass('type4')
        }

        if (number === 5) {
            target.addClass('type5')
        }

        if (number === 6) {
            target.addClass('type6')
        }

        if (number === 7) {
            target.addClass('type7')
        }
    }

    setting() {
        for (let i = 0; i < 16; i++) {
            let arr = [];
            let arr1 = [];
            for (let j = 0; j < 16; j++) {
                arr.push(0);
                arr1.push(0);
            }
            this.board.push(arr);
            this.flagBoard.push(arr1);
        }
        for (let i = 0; i < 40; i++) {
            let rand = getRandomInt(0, 15);
            let rand2 = getRandomInt(0, 15);
            this.mineNum.push({line: rand, num: rand2});
        }
        this.mineNum = [...new Set(this.mineNum.map(JSON.stringify))].map(JSON.parse);
        this.mineNum.forEach(ele => {
            this.board[ele.line][ele.num] = 'mine';
        })

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        for (let i = 1; i <= 16; i++) {
            for (let j = 1; j <= 16; j++) {
                let mineCnt = this.checkAround(i, j, true);
                this.board[i - 1][j - 1] = mineCnt;
            }
        }
        let html = '';
        let cnt = 0;
        this.board.forEach((ele, idx) => {
            cnt++
            ele.forEach((ele2, idx2) => {
                cnt++
                html += `
                <div style="background: url('./public/asset/images/closed.svg') center/cover" line-id="${idx + 1}" num-id="${idx2 + 1}" class="unopen"></div> 
                `
            })
        })
        $('.game_board').html(html);
    }

    checkAround(line, num, mineCount = false, flagChk = false) {
        let coordinateArr = [];
        line = line - 1;
        num = num - 1;
        coordinateArr.push({line: line - 1, num: num - 1})
        coordinateArr.push({line: line - 1, num: num});
        coordinateArr.push({line: line - 1, num: num + 1});
        coordinateArr.push({line: line, num: num + 1});
        coordinateArr.push({line: line, num: num - 1});
        coordinateArr.push({line: line + 1, num: num - 1});
        coordinateArr.push({line: line + 1, num: num});
        coordinateArr.push({line: line + 1, num: num + 1});
        coordinateArr = coordinateArr.filter(
            ele => cordiChk(ele)
        );

        function cordiChk(ele) {
            if (ele.line === 16) return false;
            if (ele.line === -1) return false;
            if (ele.num === -1) return false;
            if (ele.num === 16) return false;
            return true;
        }

        if (mineCount) {
            let mineCnt = 0;
            coordinateArr.forEach(ele => {
                if (this.board[ele.line][ele.num] === 'mine') {
                    mineCnt++;
                }
            })
            if (this.board[line][num] === 'mine') mineCnt = 'mine';
            return mineCnt;
        }
        if (flagChk) {
            let flagCnt = 0;
            coordinateArr.forEach(ele => {
                if (this.flagBoard[ele.line][ele.num] === 'flag') {
                    flagCnt++;
                }
            })
            return flagCnt;
        }
        return coordinateArr;
    }

}

$(() => {
    let game = new App();

})