#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <sys/resource.h>

// Include the AES functions (you'd normally link against the compiled object)
extern void inv_cfb_file(uint8_t* pwd, uint8_t* iv, const char* input_filename, const char* output_filename);
extern void inv_cfb_file_streaming(uint8_t* pwd, uint8_t* iv, const char* input_filename, const char* output_filename);

void print_memory_usage() {
    struct rusage usage;
    getrusage(RUSAGE_SELF, &usage);
    printf("Peak memory usage: %ld KB\n", usage.ru_maxrss);
}

void test_memory_efficiency() {
    uint8_t password[16] = "testpassword1234";
    uint8_t iv[16] = "testinitialvect1";
    
    printf("=== Memory Usage Comparison ===\n");
    
    printf("\n1. Testing standard mode (loads entire file):\n");
    print_memory_usage();
    // inv_cfb_file(password, iv, "test_input.bin", "output_standard.bin");
    print_memory_usage();
    
    printf("\n2. Testing streaming mode (processes in chunks):\n");
    print_memory_usage();
    // inv_cfb_file_streaming(password, iv, "test_input.bin", "output_streaming.bin");
    print_memory_usage();
}

int main() {
    printf("AES CFB Streaming vs Standard Mode Test\n");
    printf("=======================================\n");
    
    test_memory_efficiency();
    
    return 0;
}
