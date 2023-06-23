import Base.IO;
import Base.Basic;
import Base.Math;

class Program : ProgramBase {
    static TicTacToe game;

    public static void Main() {
        game = new TicTacToe();
    }
}

class TicTacToe {
    int[][] board;
    const int EMPTY = 0;
    const int PlAYER = 1;
    const int COMPUTER = 2;

    public void TicTacToe() {
        int winner = EMPTY;
        char choice;

        do {
            winner = EMPTY;
            char choice = ' ';

            resetBoard();

            while (winner == EMPTY && checkFreeSpaces() != 0) {
                printBoard();
                playerMove();

                winner = checkWinner();
                if (winner != EMPTY || checkFreeSpaces() == 0)
                    break;

                computerMove();
                winner = checkWinner();
                if (winner != EMPTY || checkFreeSpaces() == 0)
                    break;
            }
        } while (choice == 'Y');
    }

    void resetBoard() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = EMPTY;
            }
        }
    }

    void printBoard() {
        log(" ${board[0][0]} | ${board[0][1]} | ${board[0][2]} \n"); 
        log("---|---|---\n");
        log(" ${board[1][0]} | ${board[1][1]} | ${board[1][2]} \n"); 
        log("---|---|---\n");
        log(" ${board[2][0]} | ${board[2][1]} | ${board[2][2]} \n"); 
    }

    int checkFreeSpaces() {
        int emptySpots = 0;

        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == EMPTY) emptySpots++;
            }
        }

        return emptySpots;
    }

    void playerMove() {
        int x;
        int y;

        do {
            log("Enter row number (1-3): ");
            x = input();
            x--;
            log("Enter column number (1-3): ");
            y = input();
            y--;

            if (board[x][y] != EMPTY)
                log("Invalid Move!\n");
            else {
                board[x][y] = PLAYER;
                break;
            };
        } while (board[x][y] != EMPTY);
    }

    void computerMove() {
        int x;
        int y;

        if (checkFreeSpaces() > 0) {
            do
            {
                x = Math.random() % 3;
                y = Math.random() % 3;
            } while (board[x][y] != EMPTY);

            board[x][y] = COMPUTER;
        } else printWiner(PLAYER);
    }

    int checkWinner() {
        // Rows
        for (int i = 0; i < 3; i++)
            if (board[i][0] == board[i][1] && board[i][0] == board[i][2])
                return board[i][0];

        // Columns
        for (int i = 0; i < 3; i++)
            if (board[0][i] == board[1][i] && board[0][i] == board[2][i])
                return board[0][i];

        // Diagonals
        if (board[0][0] == board[1][1] && board[0][0] == board[2][2])
            return board[0][0];

        if (board[0][2] == board[1][1] && board[0][2] == board[2][0])
            return board[0][2];

        return 0;
    }

    void printWiner(int winner) {
        if (winner == PLAYER)
            printf("You Win!!\n");
        else if (winner == COMPUTER)
            printf("You Lose :((\n");
        else
            printf("It's a draw :/\n");
    }
}
