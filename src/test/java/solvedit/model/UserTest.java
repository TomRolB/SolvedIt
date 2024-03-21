package solvedit.model;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.Persistence;
import org.junit.After;
import org.junit.Before;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.function.Supplier;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThan;
import static org.junit.Assert.assertThat;

public class UserTest {
    private EntityManagerFactory managerFactory;
    private EntityManager em;

    @After
    public void tearDown() throws Exception {
        managerFactory.close();
    }

    @Before
    public void setUp() {
        managerFactory = Persistence.createEntityManagerFactory("test");
        em = managerFactory.createEntityManager();
    }

    @Test
    public void oneUserShouldBeCreated() {
        final User user = new User();

        user.setEmail("email@example.com");
        user.setFirstName("Rodrigo");
        user.setLastName("Rodríguez");

        assertThat(persist(user).getId(), greaterThan(0L));

        final Optional<User> persistedUser = findById(user.getId());

        assertThat(persistedUser.isPresent(), is(true));
        assertThat(persistedUser.get().getEmail(), is("email@example.com"));
        assertThat(persistedUser.get().getFirstName(), is("Rodrigo"));
        assertThat(persistedUser.get().getLastName(), is("Rodríguez"));

        Optional<User> byEmail = findByEmail(persistedUser.get().getEmail());
        System.out.println(byEmail);
    }

    private User persist(User user) {
        final EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            em.persist(user);

            tx.commit();
            return user;
        } catch (Exception e) {
            tx.rollback();
            throw e;
        }
    }

    private Optional<User> findById(Long id){
        return tx(() ->
                Optional.of(em.find(User.class, id))
        );
    }

    private Optional<User> findByEmail(String email){
        return tx(() -> (em
                        .createQuery("SELECT u FROM User u WHERE u.email LIKE :email")
                        .setParameter("email", email).getResultList()).stream()
                .findFirst()
        );
    }

    private <R> R tx(Supplier<R> s) {
        final EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            R r = s.get();

            tx.commit();
            return r;
        } catch (Exception e) {
            tx.rollback();
            throw e;
        }
    }
}
