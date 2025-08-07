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

// Test and demonstration functions
void demo_aes_variants() {
    printf("=== AES Implementation Demo ===\n");
    
    // Test AES-128
    printf("\n--- Testing AES-128 ---\n");
    set_aes_variant(AES_128);
    printf("Key size: %d bytes, Rounds: %d, Round keys: %d\n", 
           KEY_BYTES(), NR(), ROUND_KEYS());
    
    // Test AES-256  
    printf("\n--- Testing AES-256 ---\n");
    set_aes_variant(AES_256);
    printf("Key size: %d bytes, Rounds: %d, Round keys: %d\n", 
           KEY_BYTES(), NR(), ROUND_KEYS());
    
    // Reset to AES-128
    set_aes_variant(AES_128);
}

int main() {
    demo_aes_variants();
    return 0;
}
