package com.example.demo.dto;

import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class EstatisticaRowMapper implements RowMapper<EstatisticaDTO> {
    @Override
    public EstatisticaDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        EstatisticaDTO dto = new EstatisticaDTO();
        dto.setRotulo(rs.getString("rotulo"));
        dto.setQuantidade(rs.getLong("quantidade"));
        return dto;
    }
}
