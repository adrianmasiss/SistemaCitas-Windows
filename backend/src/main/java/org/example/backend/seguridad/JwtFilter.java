package org.example.backend.seguridad;

import org.example.backend.config.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private MyUserDetailsService userDetailsService;

    // Método para verificar si una ruta es pública
    private boolean esRutaPublica(String path) {
        return path.startsWith("/api/auth")
                || path.startsWith("/api/registro")
                || path.equals("/api/medicos/aprobados")
                || path.startsWith("/api/medicos/buscar")
                || path.startsWith("/api/citas/buscar")
                || path.startsWith("/api/horarios/medico")
                || path.startsWith("/api/horario-extendido")
                || path.equals("/api/home")
                || path.startsWith("/static")
                || path.startsWith("/css")
                || path.startsWith("/js")
                || path.startsWith("/images");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();

        // Si la ruta es pública, no hacemos nada y seguimos la cadena de filtros
        if (esRutaPublica(path)) {
            chain.doFilter(request, response);
            return;
        }

        // Si la ruta NO es pública, validamos el JWT
        String header = request.getHeader("Authorization");
        String token = null;
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }
        if (token != null && jwtUtils.validateJwt(token)) {
            String username = jwtUtils.getUsernameFromJwt(token);

            // Carga el usuario y establece la autenticación
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}
