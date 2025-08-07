#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

// AES variant definitions
typedef enum {
    AES_128 = 0,
    AES_256 = 1
} aes_variant_t;

// AES parameters for different variants
typedef struct {
    int nk;  // Number of 32-bit words in the key
    int nr;  // Number of rounds
    int key_bytes;  // Key size in bytes
    int round_keys;  // Number of round key words
} aes_params_t;

// AES parameters lookup
static const aes_params_t aes_params[] = {
    {4, 10, 16, 44},  // AES-128: nk=4, nr=10, 16 bytes key, 44 round key words
    {8, 14, 32, 60}   // AES-256: nk=8, nr=14, 32 bytes key, 60 round key words
};

// Current AES variant (default to AES-128 for backward compatibility)
static aes_variant_t current_variant = AES_128;

// Convenience macros for current parameters
#define NK() (aes_params[current_variant].nk)
#define NR() (aes_params[current_variant].nr)
#define KEY_BYTES() (aes_params[current_variant].key_bytes)
#define ROUND_KEYS() (aes_params[current_variant].round_keys)

// Extended rcon array for AES256 (needs 15 elements for 14 rounds)
uint32_t rcon[16] = {
  0x00000000, 
  0x01000000, 
  0x02000000, 
  0x04000000, 
  0x08000000,
  0x10000000, 
  0x20000000, 
  0x40000000, 
  0x80000000,
  0x1b000000, 
  0x36000000,
  0x6c000000,  // Additional constants for AES256
  0xd8000000,
  0xab000000,
  0x4d000000,
  0x9a000000
};

uint8_t sbox[256] = {
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
};

// Function prototypes
void set_aes_variant(aes_variant_t variant);
aes_variant_t get_aes_variant();
void key_expansion(const uint8_t *key, uint32_t *round_keys);
void cipher(uint32_t* input, uint32_t* w, uint32_t* result);

// Function to set AES variant
void set_aes_variant(aes_variant_t variant) {
    if (variant <= AES_256) {
        current_variant = variant;
        printf("AES variant set to: %s\n", variant == AES_128 ? "AES-128" : "AES-256");
    } else {
        printf("Error: Invalid AES variant\n");
    }
}

// Function to get current AES variant
aes_variant_t get_aes_variant() {
    return current_variant;
}

uint32_t add_word(uint32_t w1, uint32_t w2) {
  return w1 ^ w2;
}

uint32_t sub_word(uint32_t w) {
  // Substitute bytes in the word using an S-box
  return 
    (sbox[(w >> 24) & 0xff] << 24) | 
    (sbox[(w >> 16) & 0xff] << 16) |
    (sbox[(w >>  8) & 0xff] <<  8) | 
    (sbox[ w        & 0xff]      );
}

uint32_t rot_word(uint32_t w) {
  // Rotate the word left by one byte
  return ((w << 8) & 0xffffff00) | ((w >> 24) & 0x000000ff);
}

void key_expansion(const uint8_t *key, uint32_t *round_keys) {
  int nk = NK();
  int nr = NR();
  
  int i = 0;
  while (i <= nk - 1) {
    round_keys[i] = 
        (key[i * 4    ] << 24) |
        (key[i * 4 + 1] << 16) |
        (key[i * 4 + 2] <<  8) |
        (key[i * 4 + 3]      );
    i++;
  }

  while (i <= 4 * nr + 3) {
    uint32_t temp = round_keys[i - 1];
    if (i % nk == 0) {
      temp = rot_word(temp);
      temp = sub_word(temp);
      temp = add_word(temp, rcon[i / nk]);
    } else if (nk > 6 && i % nk == 4) {
      temp = sub_word(temp);
    }
    round_keys[i] = add_word(round_keys[i - nk], temp);
    i++;
  }
}

void cipher(uint32_t* input, uint32_t* w, uint32_t* result) {
  int nr = NR();
  uint32_t s[4];
  memcpy(s, input, sizeof(uint32_t) * 4);
  
  // Initial round
  for (int i = 0; i < 4; i++) {
    s[i] ^= w[i];
  }

  // Main rounds (simplified for demonstration)
  for (int round = 1; round <= nr - 1; round++) {
    for (int i = 0; i < 4; i++) {
      // This is a simplified version - in real AES you'd use the T-tables
      result[i] = s[i] ^ w[round * 4 + i]; // Simplified
    }
    memcpy(s, result, sizeof(uint32_t) * 4);
  }

  // Final round
  for (int i = 0; i < 4; i++) {
    result[i] = s[i] ^ w[nr * 4 + i];
  }
}

// Test and demonstration functions
void demo_aes_variants() {
    printf("=== AES Implementation Demo ===\n");
    
    // Test AES-128
    printf("\n--- Testing AES-128 ---\n");
    set_aes_variant(AES_128);
    printf("Key size: %d bytes, Rounds: %d, Round keys: %d\n", 
           KEY_BYTES(), NR(), ROUND_KEYS());
    
    // Test key expansion for AES-128
    uint8_t key128[16] = {
        0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6,
        0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c
    };
    
    uint32_t* round_keys = (uint32_t*)calloc(ROUND_KEYS(), sizeof(uint32_t));
    if (round_keys) {
        key_expansion(key128, round_keys);
        printf("AES-128 key expansion completed successfully\n");
        free(round_keys);
    }
    
    // Test AES-256  
    printf("\n--- Testing AES-256 ---\n");
    set_aes_variant(AES_256);
    printf("Key size: %d bytes, Rounds: %d, Round keys: %d\n", 
           KEY_BYTES(), NR(), ROUND_KEYS());
    
    // Test key expansion for AES-256
    uint8_t key256[32] = {
        0x60, 0x3d, 0xeb, 0x10, 0x15, 0xca, 0x71, 0xbe,
        0x2b, 0x73, 0xae, 0xf0, 0x85, 0x7d, 0x77, 0x81,
        0x1f, 0x35, 0x2c, 0x07, 0x3b, 0x61, 0x08, 0xd7,
        0x2d, 0x98, 0x10, 0xa3, 0x09, 0x14, 0xdf, 0xf4
    };
    
    round_keys = (uint32_t*)calloc(ROUND_KEYS(), sizeof(uint32_t));
    if (round_keys) {
        key_expansion(key256, round_keys);
        printf("AES-256 key expansion completed successfully\n");
        free(round_keys);
    }
    
    // Reset to AES-128
    set_aes_variant(AES_128);
}

int main() {
    demo_aes_variants();
    return 0;
}
