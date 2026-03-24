package com.example.demo.controller;

import com.example.demo.model.VagasModel;
import com.example.demo.repository.VagasRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/vagas")
@CrossOrigin(origins = "*")

public class VagasController {

    private final VagasRepository vagasRepository;
    public VagasController(VagasRepository vagasRepository) {
        this.vagasRepository = vagasRepository;
    }
    @GetMapping 
    public Page<VagasModel> ListarVagasPaginado(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "10") int size) {
        return vagasRepository.findAll(PageRequest.of(page, size));
    }
    @GetMapping("/{id}")
    public ResponseEntity<VagasModel> BuscarVagaPorId(@PathVariable Long id) {
        return vagasRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public VagasModel CriarVaga(@RequestBody VagasModel vaga) { 
        if (vaga.getStatus() == null) {
            vaga.setStatus("Aberta");
        }
        return vagasRepository.save(vaga);
    }
    @PutMapping("/{id}")
    public ResponseEntity<VagasModel> AtualizarVaga(@PathVariable Long id, @RequestBody VagasModel vagaAtualizada) {
        return vagasRepository.findById(id)
                .map(vaga -> {
                    vaga.setTitulo(vagaAtualizada.getTitulo());
                    vaga.setArea(vagaAtualizada.getArea());
                    vaga.setTipo(vagaAtualizada.getTipo());
                    vaga.setStatus(vagaAtualizada.getStatus());
                    vagasRepository.save(vaga);
                    return ResponseEntity.ok(vaga); 
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @PatchMapping("/{id}/fechar")
    public ResponseEntity<Void> FecharVaga(@PathVariable Long id) {
    if (vagasRepository.existsById(id)) {
        vagasRepository.fecharVagaPorId(id); 
        return ResponseEntity.ok().build();
    }
    return ResponseEntity.notFound().build();
}
   @DeleteMapping("/{id}")
    public ResponseEntity<Void> DeletarVaga(@PathVariable Long id) {
        if (vagasRepository.existsById(id)) {
            vagasRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        } 
    } 
    @GetMapping("/filtros/status")
    public List<VagasModel> FiltrarVagasPorStatus(@RequestParam String status) {
        return vagasRepository.findByStatus(status);
}
}