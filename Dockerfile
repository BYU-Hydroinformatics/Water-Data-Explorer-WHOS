FROM tethysplatform/tethys-core:4.1.3

#########
# SETUP #
#########

COPY . ${TETHYS_HOME}/apps/Water-Data-Explorer-WHOS

# ###########
# # INSTALL #
# ###########

RUN cd /tethys_apps/Water-Data-Explorer-WHOS &&\
  git switch -c la_plata origin/la_plata && \
  micromamba install --yes --file requirements.txt -c conda-forge && \
  pip install pywaterml && \
  pip install psycopg2==2.8.6 && \ 
  tethys install -N -w

#########################
# CONFIGURE ENVIRONMENT #
#########################
EXPOSE 8080

##########################
# ADD THE EXTRA MIDDLEWARE 
##########################

COPY docker_files/custom_middleware.py /usr/lib/tethys/tethys/tethys_portal/

######################################################
# CHANGE THE PROXY TIME REPLACING THE NGINX TEMPLATE #
######################################################

COPY docker_files/nginx /usr/lib/tethys/tethys/tethys_cli/gen_templates/

################
# COPY IN SALT #
################

## Be sure to be inside the docker_files folder ##
COPY docker_files/salt/ /srv/salt/

# #####################################
# # ADDITIONAL DATABASE CONFIGURATION #
# #####################################
COPY docker_files/fix.sql $HOME
COPY docker_files/configure_db.sh $HOME

# ######################
# # CONFIGURE FINAL_RUN #
# ######################
COPY docker_files/final_run.sh $HOME

# #######
# # RUN #
# #######
CMD bash final_run.sh
