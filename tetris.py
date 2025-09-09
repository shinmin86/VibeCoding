#cmd
#pip install pygame

import pygame
import random
import sys
import os

# 색상 정의 (흑백 테마)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
DARK_GRAY = (32, 32, 32)      # 매우 어두운 회색
GRAY = (64, 64, 64)           # 어두운 회색
MEDIUM_GRAY = (96, 96, 96)    # 중간 회색
LIGHT_GRAY = (128, 128, 128)  # 밝은 회색
BRIGHT_GRAY = (160, 160, 160) # 더 밝은 회색
VERY_LIGHT_GRAY = (192, 192, 192) # 매우 밝은 회색
ALMOST_WHITE = (224, 224, 224)    # 거의 흰색
BORDER_GRAY = (80, 80, 80)    # 테두리용 회색

# 게임 설정
GRID_WIDTH = 10
GRID_HEIGHT = 20
CELL_SIZE = 30
GRID_X_OFFSET = 50
GRID_Y_OFFSET = 50

# 테트로미노 모양 정의
SHAPES = [
    # I 모양
    [['.....',
      '..#..',
      '..#..',
      '..#..',
      '..#..'],
     ['.....',
      '.....',
      '####.',
      '.....',
      '.....']],
    
    # O 모양
    [['.....',
      '.....',
      '.##..',
      '.##..',
      '.....']],
    
    # T 모양
    [['.....',
      '.....',
      '.#...',
      '###..',
      '.....'],
     ['.....',
      '.....',
      '.#...',
      '.##..',
      '.#...'],
     ['.....',
      '.....',
      '.....',
      '###..',
      '.#...'],
     ['.....',
      '.....',
      '.#...',
      '##...',
      '.#...']],
    
    # S 모양
    [['.....',
      '.....',
      '.##..',
      '##...',
      '.....'],
     ['.....',
      '.#...',
      '.##..',
      '..#..',
      '.....']],
    
    # Z 모양
    [['.....',
      '.....',
      '##...',
      '.##..',
      '.....'],
     ['.....',
      '..#..',
      '.##..',
      '.#...',
      '.....']],
    
    # J 모양
    [['.....',
      '.#...',
      '.#...',
      '##...',
      '.....'],
     ['.....',
      '.....',
      '#....',
      '###..',
      '.....'],
     ['.....',
      '.##..',
      '.#...',
      '.#...',
      '.....'],
     ['.....',
      '.....',
      '###..',
      '..#..',
      '.....']],
    
    # L 모양
    [['.....',
      '..#..',
      '..#..',
      '.##..',
      '.....'],
     ['.....',
      '.....',
      '###..',
      '#....',
      '.....'],
     ['.....',
      '##...',
      '.#...',
      '.#...',
      '.....'],
     ['.....',
      '.....',
      '..#..',
      '###..',
      '.....']]
]

# 테트로미노 색상 (흑백 테마)
SHAPE_COLORS = [DARK_GRAY, GRAY, MEDIUM_GRAY, LIGHT_GRAY, BRIGHT_GRAY, VERY_LIGHT_GRAY, ALMOST_WHITE]

class Tetromino:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.shape = random.randint(0, len(SHAPES) - 1)
        self.rotation = 0
        self.color = SHAPE_COLORS[self.shape]
    
    def get_rotated_shape(self):
        return SHAPES[self.shape][self.rotation % len(SHAPES[self.shape])]
    
    def get_cells(self):
        cells = []
        shape = self.get_rotated_shape()
        for i, row in enumerate(shape):
            for j, cell in enumerate(row):
                if cell == '#':
                    cells.append((self.x + j, self.y + i))
        return cells

class TetrisGame:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((400, 700))
        pygame.display.set_caption("테트리스")
        self.clock = pygame.time.Clock()
        
        self.grid = [[BLACK for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.current_piece = None
        self.next_piece = None
        self.score = 0
        self.lines_cleared = 0
        self.fall_time = 0
        self.fall_speed = 500  # 밀리초
        
        # 한글 폰트 설정
        print("한글 폰트를 로드하는 중...")
        self.font = self.load_korean_font(36)
        self.small_font = self.load_korean_font(24)
        print("게임을 시작합니다!")
        
        self.spawn_piece()
        self.spawn_next_piece()
    
    def load_korean_font(self, size):
        """한글 폰트를 로드하는 메서드"""
        # Windows 폰트 경로들
        windows_fonts = [
            "C:/Windows/Fonts/malgun.ttf",  # 맑은 고딕
            "C:/Windows/Fonts/gulim.ttc",   # 굴림
            "C:/Windows/Fonts/batang.ttc",  # 바탕
            "C:/Windows/Fonts/dotum.ttc",   # 돋움
        ]
        
        # macOS 폰트 경로들
        macos_fonts = [
            "/System/Library/Fonts/AppleSDGothicNeo.ttc",
            "/System/Library/Fonts/Helvetica.ttc",
        ]
        
        # Linux 폰트 경로들
        linux_fonts = [
            "/usr/share/fonts/truetype/nanum/NanumGothic.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ]
        
        # 현재 운영체제에 따라 폰트 시도
        if os.name == 'nt':  # Windows
            font_paths = windows_fonts
        elif sys.platform == 'darwin':  # macOS
            font_paths = macos_fonts
        else:  # Linux
            font_paths = linux_fonts
        
        # 폰트 파일이 존재하는지 확인하고 로드
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    print(f"폰트 로드 성공: {font_path}")
                    return pygame.font.Font(font_path, size)
                except Exception as e:
                    print(f"폰트 로드 실패: {font_path} - {e}")
                    continue
        
        # 한글 폰트를 찾을 수 없으면 기본 폰트 사용
        print("한글 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.")
        print("한글이 제대로 표시되지 않을 수 있습니다.")
        return pygame.font.Font(None, size)
    
    def spawn_piece(self):
        if self.next_piece is not None:
            self.current_piece = self.next_piece
            self.current_piece.x = GRID_WIDTH // 2 - 2
            self.current_piece.y = 0
        else:
            self.current_piece = Tetromino(GRID_WIDTH // 2 - 2, 0)
        
        # 게임 오버 체크
        if self.check_collision():
            self.game_over()
    
    def spawn_next_piece(self):
        self.next_piece = Tetromino(0, 0)
    
    def check_collision(self, dx=0, dy=0, rotation=0):
        if self.current_piece is None:
            return False
        
        # 임시로 위치/회전 변경
        old_x, old_y, old_rotation = self.current_piece.x, self.current_piece.y, self.current_piece.rotation
        self.current_piece.x += dx
        self.current_piece.y += dy
        self.current_piece.rotation += rotation
        
        cells = self.current_piece.get_cells()
        collision = False
        
        for x, y in cells:
            if (x < 0 or x >= GRID_WIDTH or 
                y >= GRID_HEIGHT or 
                (y >= 0 and self.grid[y][x] != BLACK)):
                collision = True
                break
        
        # 원래 위치/회전으로 복원
        self.current_piece.x, self.current_piece.y, self.current_piece.rotation = old_x, old_y, old_rotation
        
        return collision
    
    def place_piece(self):
        if self.current_piece is None:
            return
        
        cells = self.current_piece.get_cells()
        for x, y in cells:
            if y >= 0:
                self.grid[y][x] = self.current_piece.color
        
        self.clear_lines()
        self.spawn_piece()
        self.spawn_next_piece()
    
    def clear_lines(self):
        lines_to_clear = []
        for y in range(GRID_HEIGHT):
            if all(cell != BLACK for cell in self.grid[y]):
                lines_to_clear.append(y)
        
        for y in lines_to_clear:
            del self.grid[y]
            self.grid.insert(0, [BLACK for _ in range(GRID_WIDTH)])
        
        if lines_to_clear:
            self.lines_cleared += len(lines_to_clear)
            self.score += len(lines_to_clear) * 100 * (len(lines_to_clear) + 1)
            # 속도 증가
            self.fall_speed = max(50, self.fall_speed - 10)
    
    def move_piece(self, dx, dy):
        if not self.check_collision(dx, dy):
            self.current_piece.x += dx
            self.current_piece.y += dy
            return True
        return False
    
    def rotate_piece(self):
        if not self.check_collision(0, 0, 1):
            self.current_piece.rotation += 1
            return True
        return False
    
    def drop_piece(self):
        while self.move_piece(0, 1):
            self.score += 1
    
    def game_over(self):
        # 게임 오버 화면 표시
        self.screen.fill(BLACK)
        
        # 게임 오버 텍스트
        game_over_text = self.font.render("게임 오버!", True, WHITE)
        score_text = self.font.render(f"최종 점수: {self.score}", True, LIGHT_GRAY)
        restart_text = self.small_font.render("아무 키나 누르면 종료", True, MEDIUM_GRAY)
        
        # 텍스트 중앙 정렬
        game_over_rect = game_over_text.get_rect(center=(self.screen.get_width()//2, 250))
        score_rect = score_text.get_rect(center=(self.screen.get_width()//2, 300))
        restart_rect = restart_text.get_rect(center=(self.screen.get_width()//2, 350))
        
        self.screen.blit(game_over_text, game_over_rect)
        self.screen.blit(score_text, score_rect)
        self.screen.blit(restart_text, restart_rect)
        
        pygame.display.flip()
        
        # 키 입력 대기
        waiting = True
        while waiting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT or event.type == pygame.KEYDOWN:
                    waiting = False
        
        pygame.quit()
        sys.exit()
    
    def draw_grid(self):
        # 그리드 배경
        for y in range(GRID_HEIGHT):
            for x in range(GRID_WIDTH):
                rect = pygame.Rect(
                    GRID_X_OFFSET + x * CELL_SIZE,
                    GRID_Y_OFFSET + y * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                )
                pygame.draw.rect(self.screen, self.grid[y][x], rect)
                pygame.draw.rect(self.screen, BORDER_GRAY, rect, 1)
    
    def draw_piece(self, piece, offset_x=0, offset_y=0):
        if piece is None:
            return
        
        cells = piece.get_cells()
        for x, y in cells:
            if y >= 0:
                rect = pygame.Rect(
                    GRID_X_OFFSET + (x + offset_x) * CELL_SIZE,
                    GRID_Y_OFFSET + (y + offset_y) * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                )
                pygame.draw.rect(self.screen, piece.color, rect)
                pygame.draw.rect(self.screen, WHITE, rect, 2)
    
    def draw_next_piece(self):
        if self.next_piece is None:
            return
        
        # 다음 블록 표시 영역
        next_x = GRID_X_OFFSET + GRID_WIDTH * CELL_SIZE + 20
        next_y = GRID_Y_OFFSET + 50
        
        # 다음 블록 그리기
        cells = self.next_piece.get_cells()
        for x, y in cells:
            rect = pygame.Rect(
                next_x + x * CELL_SIZE,
                next_y + y * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            )
            pygame.draw.rect(self.screen, self.next_piece.color, rect)
            pygame.draw.rect(self.screen, WHITE, rect, 1)
    
    def draw_ui(self):
        # 점수 표시
        score_text = self.font.render(f"점수: {self.score}", True, WHITE)
        self.screen.blit(score_text, (GRID_X_OFFSET + GRID_WIDTH * CELL_SIZE + 20, 20))
        
        # 라인 수 표시
        lines_text = self.small_font.render(f"라인: {self.lines_cleared}", True, WHITE)
        self.screen.blit(lines_text, (GRID_X_OFFSET + GRID_WIDTH * CELL_SIZE + 20, 60))
        
        # 다음 블록 라벨
        next_text = self.small_font.render("다음:", True, WHITE)
        self.screen.blit(next_text, (GRID_X_OFFSET + GRID_WIDTH * CELL_SIZE + 20, 100))
        
        # 조작법 표시
        controls = [
            "조작법:",
            "← → : 이동",
            "↓ : 빠른 낙하",
            "↑ : 회전",
            "스페이스: 즉시 낙하"
        ]
        
        for i, text in enumerate(controls):
            control_text = self.small_font.render(text, True, WHITE)
            self.screen.blit(control_text, (GRID_X_OFFSET + GRID_WIDTH * CELL_SIZE + 20, 200 + i * 25))
    
    def run(self):
        running = True
        
        while running:
            dt = self.clock.tick(60)
            self.fall_time += dt
            
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_LEFT:
                        self.move_piece(-1, 0)
                    elif event.key == pygame.K_RIGHT:
                        self.move_piece(1, 0)
                    elif event.key == pygame.K_DOWN:
                        if self.move_piece(0, 1):
                            self.score += 1
                    elif event.key == pygame.K_UP:
                        self.rotate_piece()
                    elif event.key == pygame.K_SPACE:
                        self.drop_piece()
            
            # 자동 낙하
            if self.fall_time >= self.fall_speed:
                if not self.move_piece(0, 1):
                    self.place_piece()
                self.fall_time = 0
            
            # 화면 그리기
            self.screen.fill(BLACK)
            self.draw_grid()
            self.draw_piece(self.current_piece)
            self.draw_next_piece()
            self.draw_ui()
            
            pygame.display.flip()
        
        pygame.quit()

if __name__ == "__main__":
    game = TetrisGame()
    game.run()
