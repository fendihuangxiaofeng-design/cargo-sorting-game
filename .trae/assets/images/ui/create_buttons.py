import zlib
import struct

def crc32(data):
    return zlib.crc32(data) & 0xffffffff

def create_png(width, height, pixels):
    signature = b'\x89PNG\r\n\x1a\n'
    
    def chunk(chunk_type, data):
        length = struct.pack('>I', len(data))
        chunk_data = chunk_type + data
        crc = struct.pack('>I', crc32(chunk_data))
        return length + chunk_data + crc
    
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_chunk = chunk(b'IHDR', ihdr)
    
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'
        for x in range(width):
            idx = (y * width + x) * 4
            raw_data += bytes(pixels[idx:idx+4])
    
    compressed = zlib.compress(raw_data)
    idat_chunk = chunk(b'IDAT', compressed)
    
    iend_chunk = chunk(b'IEND', b'')
    
    return signature + ihdr_chunk + idat_chunk + iend_chunk

# 创建养马屋按钮
width, height = 200, 200
pixels = []
for y in range(height):
    for x in range(width):
        if 10 <= x < 190 and 10 <= y < 190:
            pixels.extend([0, 150, 0, 255])
        else:
            pixels.extend([0, 0, 0, 0])

with open('main_button_barn.png', 'wb') as f:
    f.write(create_png(width, height, pixels))

# 创建商店按钮
with open('main_button_shop.png', 'wb') as f:
    f.write(create_png(width, height, pixels))

# 创建赛场按钮
with open('main_button_race.png', 'wb') as f:
    f.write(create_png(width, height, pixels))

# 创建设置按钮
with open('main_button_settings.png', 'wb') as f:
    f.write(create_png(width, height, pixels))

# 创建开始游戏按钮
width, height = 400, 200
pixels = []
for y in range(height):
    for x in range(width):
        if 10 <= x < 390 and 10 <= y < 190:
            pixels.extend([255, 255, 255, 255])
        else:
            pixels.extend([0, 0, 0, 0])

with open('main_button_start.png', 'wb') as f:
    f.write(create_png(width, height, pixels))

print('切图文件已创建!')
