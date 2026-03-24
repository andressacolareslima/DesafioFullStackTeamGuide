package com.example.demo.repository;

import com.example.demo.model.VagasModel;
import org.springframework.data.jdbc.repository.query.Modifying; 
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface VagasRepository extends CrudRepository<VagasModel, Long>, PagingAndSortingRepository<VagasModel, Long> {

    @Query("SELECT * FROM vagas WHERE status = :status")
    List<VagasModel> findByStatus(String status);

    @Query("SELECT * FROM vagas WHERE area = :area")
    List<VagasModel> findByArea(String area);

    @Query("SELECT * FROM vagas WHERE titulo ILIKE %:titulo%")
    List<VagasModel> findByTituloContaining(String titulo);

    @Modifying
    @Transactional
    @Query("UPDATE vagas SET status = 'Fechada' WHERE id = :id")
    void fecharVagaPorId(Long id);

    @Modifying
    @Transactional
    @Query("DELETE FROM vagas WHERE id = :id")
    void deletarVagaManual(Long id);
}