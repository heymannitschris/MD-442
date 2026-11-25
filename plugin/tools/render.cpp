// Offline render of the C++ engine, for comparing with the web engine.
// render <out.wav> <preset 0-6> <what: BD|SD|...|bars:N> [secs] [rate]
#include "../src/Engine.h"
#include <cstdio>
#include <cstring>
#include <thread>
#include <chrono>
using namespace md442;

static void writeWav(const char* path, const std::vector<float>& L, const std::vector<float>& R, int sr) {
    FILE* f = std::fopen(path, "wb"); if (!f) return;
    uint32_t n = (uint32_t)L.size(), data = n * 2 * 4, v32; uint16_t v16;
    std::fwrite("RIFF", 1, 4, f); v32 = 36 + data; std::fwrite(&v32, 4, 1, f); std::fwrite("WAVEfmt ", 1, 8, f);
    v32 = 16; std::fwrite(&v32, 4, 1, f); v16 = 3; std::fwrite(&v16, 2, 1, f); v16 = 2; std::fwrite(&v16, 2, 1, f);
    v32 = (uint32_t)sr; std::fwrite(&v32, 4, 1, f); v32 = (uint32_t)sr * 8; std::fwrite(&v32, 4, 1, f); v16 = 8; std::fwrite(&v16, 2, 1, f); v16 = 32; std::fwrite(&v16, 2, 1, f);
    std::fwrite("data", 1, 4, f); std::fwrite(&data, 4, 1, f);
    for (uint32_t i = 0; i < n; ++i) { std::fwrite(&L[i], 4, 1, f); std::fwrite(&R[i], 4, 1, f); }
    std::fclose(f);
}

int main(int argc, char** argv) {
    if (argc < 4) { std::fprintf(stderr, "render out.wav preset what [secs] [rate]\n"); return 1; }
    int preset = std::atoi(argv[2]); double secs = argc > 4 ? std::atof(argv[4]) : 2.5; int sr = argc > 5 ? std::atoi(argv[5]) : 44100;
    Engine e; e.loadPreset(preset);
    for (int a = 6; a < argc; ++a) { std::string kv = argv[a]; auto q = kv.find('='); if (q != std::string::npos) { int j = defIndex(kv.substr(0, q)); if (j >= 0) e.P[(size_t)j] = std::atof(kv.c_str() + q + 1); } }
    bool live = false; for (int a = 6; a < argc; ++a) if (std::string(argv[a]) == "live") live = true;
    e.prepare(sr, live); if (live) std::this_thread::sleep_for(std::chrono::milliseconds(50));
    std::string what = argv[3]; Transport tr;
    std::vector<float> L((size_t)(secs * sr)), R(L.size());
    if (what.rfind("bars:", 0) == 0) {
        // play N bars on the engine's own clock, from 20 ms in, the same as the web test render
        e.internalPlay = false; int bars = std::atoi(what.c_str() + 5); (void)bars;
        int pre = (int)(.02 * sr); e.process(L.data(), R.data(), pre, tr);
        e.internalPlay = true;
        size_t pos = (size_t)pre; double stop = .02 + bars * 16 * 60 / e.pv("bpm") / 4;
        while (pos < L.size()) {
            int n = (int)std::min<size_t>(256, L.size() - pos);
            if (e.now >= stop) e.internalPlay = false;
            e.process(L.data() + pos, R.data() + pos, n, tr); pos += (size_t)n;
        }
    } else {
        int k = -1; for (int i = 0; i < NUM_SOUND; ++i) if (what == voices()[(size_t)i].id) k = i;
        if (k < 0) { std::fprintf(stderr, "unknown voice\n"); return 1; }
        e.voice(k, .02, 0, 1);
        for (size_t pos = 0; pos < L.size(); pos += 256) e.process(L.data() + pos, R.data() + pos, (int)std::min<size_t>(256, L.size() - pos), tr);
    }
    writeWav(argv[1], L, R, sr);
    return 0;
}
