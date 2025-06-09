package org.example.backend.config;

import org.example.backend.seguridad.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // No usamos CSRF porque es una API REST (sin sesiones)
                .csrf(csrf -> csrf.disable())
                // Configuración de endpoints públicos (puedes ajustar según lo que tu frontend necesita)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",            // login, registro y refresh token
                                "/api/registro/**",
                                "/api/citas/buscar",       // búsqueda pública
                                "/api/medicos/aprobados",  // listado público de médicos
                                "/api/medicos/buscar",     // búsqueda pública de médicos
                                "/api/horarios/medico/**",
                                "/api/horario-extendido/**",
                                "/api/home",
                                "/static/**",
                                "/css/**", "/js/**", "/images/**"
                        ).permitAll()
                        // El resto requiere autenticación (token JWT válido)
                        .anyRequest().authenticated()
                )
                // Sin sesiones, stateless
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Filtro JWT para validar tokens en cada request
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
