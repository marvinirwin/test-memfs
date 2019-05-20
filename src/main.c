#include <stdio.h>
#include <string.h>
// It's ether errno.h or sys/errno.h
#include <errno.h>

int main() {
    FILE *f = fopen("./main.c", "rb");
    if (f) {
        printf("file opened!\n");
    } else {
        printf("%s\n", strerror(errno));
    }

    return 0;
}