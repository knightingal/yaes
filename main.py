# nk = 4, nb = 4, nr = 10


def multiplication(x, y):
    multi_array = [x]
    for i in range(0, 8):
        temp = multi_array[-1] << 1
        if temp > 0xff:
            temp ^= 0x11b
        multi_array.append(temp)

    ret = 0
    for i in range(0, 8):
        ret ^= multi_array[i] * (y >> i & 1)

    return ret


print hex(multiplication(0x7c, 2))


SBox = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
]

InvSBox = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
]


def sub_bytes(b):
    return SBox[b]


def inv_sub_bytes(b):
    return InvSBox[b]


def sub_state(state):
    for i in range(0, 4):
        for j in range(0, 4):
            state[i][j] = sub_bytes(state[i][j])


def inv_sub_state(state):
    for i in range(0, 4):
        for j in range(0, 4):
            state[i][j] = inv_sub_bytes(state[i][j])


def shift_row(row):
    row[0], row[1], row[2], row[3] = row[1], row[2], row[3], row[0]


def shift_rows(state):
    shift_row(state[1])

    shift_row(state[2])
    shift_row(state[2])

    shift_row(state[3])
    shift_row(state[3])
    shift_row(state[3])


def inv_shift_rows(state):
    shift_row(state[1])
    shift_row(state[1])
    shift_row(state[1])

    shift_row(state[2])
    shift_row(state[2])

    shift_row(state[3])


def mix_columns(state):
    for i in range(0, 4):
        state0 = multiplication(2, state[0][i]) ^ multiplication(3, state[1][i]) ^ state[2][i] ^ state[3][i]
        state1 = multiplication(2, state[1][i]) ^ multiplication(3, state[2][i]) ^ state[0][i] ^ state[3][i]
        state2 = multiplication(2, state[2][i]) ^ multiplication(3, state[3][i]) ^ state[0][i] ^ state[1][i]
        state3 = multiplication(2, state[3][i]) ^ multiplication(3, state[0][i]) ^ state[1][i] ^ state[2][i]

        state[0][i] = state0
        state[1][i] = state1
        state[2][i] = state2
        state[3][i] = state3


def inv_mix_columns(state):
    for i in range(0, 4):
        state0 = multiplication(0xe, state[0][i]) ^ multiplication(0xb, state[1][i]) ^ \
                 multiplication(0xd, state[2][i]) ^ multiplication(0x9, state[3][i])

        state1 = multiplication(0x9, state[0][i]) ^ multiplication(0xe, state[1][i]) ^ \
                 multiplication(0xb, state[2][i]) ^ multiplication(0xd, state[3][i])

        state2 = multiplication(0xd, state[0][i]) ^ multiplication(0x9, state[1][i]) ^ \
                 multiplication(0xe, state[2][i]) ^ multiplication(0xb, state[3][i])

        state3 = multiplication(0xb, state[0][i]) ^ multiplication(0xd, state[1][i]) ^ \
                 multiplication(0x9, state[2][i]) ^ multiplication(0xe, state[3][i])

        state[0][i] = state0
        state[1][i] = state1
        state[2][i] = state2
        state[3][i] = state3


def add_round_key(state, word):
    for i in range(0, 4):
        state[0][i] ^= word[i][0]
        state[1][i] ^= word[i][1]
        state[2][i] ^= word[i][2]
        state[3][i] ^= word[i][3]


def sub_word(word):
    return [SBox[word[0]], SBox[word[1]], SBox[word[2]], SBox[word[3]]]


def rot_word(word):
    return [word[1], word[2], word[3], word[0]]


import ctypes

Rcon = [0, 0x1, 0x2, 0x4, 0x8, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]


def print_state(state):
    pass
    # print '---------------------'
    # for w in state:
    #     print '[' + hex(w[0]) + ' ' + hex(w[1]) + ' ' + hex(w[2]) + ' ' + hex(w[3]) + '][' \
    #           + str(ctypes.c_int32(w[0] << 24 | w[1] << 16 | w[2] << 8 | w[3]).value) + ']'


def key_expansion(key, nb, nr, nk):
    w = []
    for i in range(0, nk):
        w.append([key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]])

    for i in range(nk, nb * (nr + 1)):
        temp = w[i - 1]
        if i % nk == 0:
            temp = sub_word(rot_word(temp))
            temp[0] ^= Rcon[i / nk]
        elif nk > 6 and i % nk == 4:
            temp = sub_word(temp)
        w.append([w[i - nk][0] ^ temp[0], w[i - nk][1] ^ temp[1], w[i - nk][2] ^ temp[2], w[i - nk][3] ^ temp[3]])
    print_state(w)
    return w


def cipher(input_date, w, nb, nr):
    state = [[None] * 4, [None] * 4, [None] * 4, [None] * 4]
    for i in range(0, 4):
        for j in range(0, 4):
            state[i][j] = input_date[j * 4 + i]
    add_round_key(state, w[0:nb])
    print_state(state)

    for r in range(1, nr):
        sub_state(state)
        print_state(state)
        shift_rows(state)
        print_state(state)
        mix_columns(state)
        print_state(state)
        add_round_key(state, w[r * nb: (r + 1) * nb])
        print_state(state)

    sub_state(state)
    print_state(state)
    shift_rows(state)
    print_state(state)
    add_round_key(state, w[nr * nb: (nr + 1) * nb])
    print_state(state)

    ret = [None] * 16
    for i in range(0, 4):
        for j in range(0, 4):
            ret[j * 4 + i] = state[i][j]
    return ret


def inv_cipher(input_date, w, nb, nr):
    state = [[None] * 4, [None] * 4, [None] * 4, [None] * 4]
    for i in range(0, 4):
        for j in range(0, 4):
            state[i][j] = input_date[j * 4 + i]
            # state[i][j] = input_date[j][i]
    add_round_key(state, w[nr * nb:(nr + 1) * nb])
    print_state(state)

    for r in range(1, nr)[::-1]:
        inv_shift_rows(state)
        print_state(state)
        inv_sub_state(state)
        print_state(state)
        add_round_key(state, w[r * nb: (r + 1) * nb])
        print_state(state)
        inv_mix_columns(state)
        print_state(state)

    inv_shift_rows(state)
    print_state(state)
    inv_sub_state(state)
    print_state(state)
    add_round_key(state, w[0: nb])
    print_state(state)

    ret = [None] * 16
    for i in range(0, 4):
        for j in range(0, 4):
            ret[j * 4 + i] = state[i][j]
    return ret


def print_buff(buff):
    output = '['
    for data in buff:
        output += hex(data) + ' '
    output += ']'
    print output


# cipher([
#     [0x32, 0x88, 0x31, 0xe0],
#     [0x43, 0x5a, 0x31, 0x37],
#     [0xf6, 0x30, 0x98, 0x07],
#     [0xa8, 0x8d, 0xa2, 0x34]
# ], key_expansion([0x2b, 0x7e, 0x15, 0x16,
#                   0x28, 0xae, 0xd2, 0xa6,
#                   0xab, 0xf7, 0x15, 0x88,
#                   0x09, 0xcf, 0x4f, 0x3c], 4, 10, 4), 4, 10)
ret = inv_cipher([0x39, 0x25, 0x84, 0x1d, 0x02, 0xdc, 0x09, 0xfb, 0xdc, 0x11, 0x85, 0x97, 0x19, 0x6a, 0x0b, 0x32],
                 key_expansion([0x2b, 0x7e, 0x15, 0x16,
                                0x28, 0xae, 0xd2, 0xa6,
                                0xab, 0xf7, 0x15, 0x88,
                                0x09, 0xcf, 0x4f, 0x3c], 4, 10, 4), 4, 10)

print_buff(ret)

retd = cipher([0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66],
              key_expansion([0x30, 0x31, 0x32, 0x33,
                             0x34, 0x35, 0x36, 0x37,
                             0x38, 0x39, 0x61, 0x62,
                             0x63, 0x64, 0x65, 0x66], 4, 10, 4), 4, 10)

text = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]
encrypted = map(lambda t, iv: t ^ iv, text, retd)
print_buff(encrypted)

retd = cipher(encrypted,
              key_expansion([0x30, 0x31, 0x32, 0x33,
                             0x34, 0x35, 0x36, 0x37,
                             0x38, 0x39, 0x61, 0x62,
                             0x63, 0x64, 0x65, 0x66], 4, 10, 4), 4, 10)

text = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]
encrypted = map(lambda t, iv: t ^ iv, text, retd)
print_buff(encrypted)

retd = cipher(encrypted,
              key_expansion([0x30, 0x31, 0x32, 0x33,
                             0x34, 0x35, 0x36, 0x37,
                             0x38, 0x39, 0x61, 0x62,
                             0x63, 0x64, 0x65, 0x66], 4, 10, 4), 4, 10)

text = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]
encrypted = map(lambda t, iv: t ^ iv, text, retd)
print_buff(encrypted)

retd = cipher(encrypted,
              key_expansion([0x30, 0x31, 0x32, 0x33,
                             0x34, 0x35, 0x36, 0x37,
                             0x38, 0x39, 0x61, 0x62,
                             0x63, 0x64, 0x65, 0x66], 4, 10, 4), 4, 10)

text = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]
encrypted = map(lambda t, iv: t ^ iv, text, retd)
print_buff(encrypted)
