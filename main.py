import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Set up display
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Simple 2D Mini Game")

# Set up the player
player_size = 50
player_color = (0, 128, 255)
player_pos = [width // 2, height - 2 * player_size]

# Set up the enemy
enemy_size = 50
enemy_color = (255, 0, 0)
enemy_pos = [width // 2, 0]

# Set up the game clock
clock = pygame.time.Clock()

def detect_collision(player_pos, enemy_pos):
    p_x, p_y = player_pos
    e_x, e_y = enemy_pos

    if (e_x >= p_x and e_x < (p_x + player_size)) or (p_x >= e_x and p_x < (e_x + enemy_size)):
        if (e_y >= p_y and e_y < (p_y + player_size)) or (p_y >= e_y and p_y < (e_y + enemy_size)):
            return True
    return False

# Game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and player_pos[0] > 0:
        player_pos[0] -= 5
    if keys[pygame.K_RIGHT] and player_pos[0] < width - player_size:
        player_pos[0] += 5

    enemy_pos[1] += 5
    if enemy_pos[1] > height:
        enemy_pos[1] = 0
        enemy_pos[0] = random.randint(0, width - enemy_size)

    if detect_collision(player_pos, enemy_pos):
        player_pos = [width // 2, height - 2 * player_size]
        enemy_pos = [width // 2, 0]

    screen.fill((0, 0, 0))

    pygame.draw.rect(screen, player_color, (player_pos[0], player_pos[1], player_size, player_size))
    pygame.draw.rect(screen, enemy_color, (enemy_pos[0], enemy_pos[1], enemy_size, enemy_size))

    pygame.display.flip()
    clock.tick(30)